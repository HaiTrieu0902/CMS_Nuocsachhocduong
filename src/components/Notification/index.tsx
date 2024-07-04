/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import notificationIcon from '@/../public/icons/Notification.svg';
import { DEFAULT_SIZE_PAGE, authUser } from '@/constants';
import useLoading from '@/hooks/useLoading';
import { INotification } from '@/models/notification.model';
import { getListNotificationAPI, readNotificationAPI } from '@/services/api/notification';
import { convertDate, renderContentClearSpecialCharacter } from '@/utils/common';
import { Badge, Col, Popover, Row, Spin, Typography, message, notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { onMessageListener } from './../../../firebase/fcmService';
import './Notification.scss';
const Notification = () => {
  const [api, contextHolder] = notification.useNotification();
  const [clicked, setClicked] = useState(false);
  const { isLoading, withLoading } = useLoading();
  const [listNotification, setListNotification] = useState<INotification[]>([]);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [totalParam, setTotalParam] = useState({
    totalUnread: 0,
    totalNotification: 0,
    currentPage: 0,
    inCreaseNotifications: 0,
  });

  const getListNotification = async (page: number) => {
    await withLoading(async () => {
      try {
        const param = {
          page: page,
          pageSize: DEFAULT_SIZE_PAGE,
          receiverId: authUser?.id || '68821b5d-176c-4e2d-a0ca-2cd7d0641d47',
        };
        const res = await getListNotificationAPI(param);
        if (listNotification) {
          setListNotification([...listNotification, ...res?.data]);
        } else {
          setListNotification(res?.data);
        }
        setTotalParam((prev) => ({
          ...prev,
          totalUnread: res?.totalUnread,
          totalNotification: res?.total,
          currentPage: page,
        }));
      } catch (error: any) {}
    });
  };

  const loadMoreData = () => {
    if (listNotification?.length < totalParam?.totalNotification) {
      const nextPage = totalParam?.currentPage + 1;
      getListNotification(nextPage);
    }
  };

  const handleClickChange = (open: boolean) => {
    setClicked(open);
  };

  useEffect(() => {
    const pushNotification = onMessageListener().then((payload: any) => {
      setListNotification((prev: any) => [
        {
          id: payload?.data?.notiId,
          title: payload?.data?.title,
          isRead: false,
          isReadAdmin: false,
          type: 'install',
          data: {
            time: new Date(),
            title: payload?.data?.title,
          },
        },
        ...prev,
      ]);
      if (payload) {
        setTotalParam((prev) => ({
          ...prev,
          inCreaseNotifications: totalParam?.inCreaseNotifications + 1,
        }));
        const openNotification = (placement: NotificationPlacement) => {
          api.info({
            message: `Notification`,
            description: `${renderContentClearSpecialCharacter(payload.notification?.body)}`,
            placement,
          });
        };
        openNotification('topRight');
      }
    });
    return () => {
      pushNotification.catch((err: any) => {
        console.log('Failed: ', err);
      });
    };
  });

  const hanldeUpdateAllReadNotification = async () => {
    try {
      //const res = await readAllNotificationsAPI(authUser()?.id);
      setListNotification([]);
      setTotalParam((prev) => ({
        ...prev,
        totalUnread: 0,
        totalNotification: 0,
        inCreaseNotifications: 0,
      }));
      message.success('Đánh dấu đã đọc hết tất cả thông báo thành công');
      setClicked(false);
      setTriggerLoading(!triggerLoading);
    } catch (error) {}
  };

  const handleReadNotification = async (data: INotification) => {
    try {
      if (data?.id) {
        await readNotificationAPI(data?.id);
        setListNotification([]);
        setTotalParam((prev) => ({
          ...prev,
          inCreaseNotifications: 0,
        }));
        setTriggerLoading(!triggerLoading);
        setClicked(false);
      }
    } catch (error) {}
  };

  const groupNotificationsByDate = (notifications: INotification[]) => {
    const today = dayjs().format('YYYY-MM-DD');
    const groupedNotifications: { title: string; notifications: INotification[] }[] = [];
    notifications.forEach((notification) => {
      const createdAtDate = dayjs(notification.createdAt).format('YYYY-MM-DD');
      const groupTitle = createdAtDate === today ? 'Hôm nay' : 'Ngày trước';
      const existingGroup = groupedNotifications.find((group) => group.title === groupTitle);
      if (existingGroup) {
        existingGroup.notifications.push(notification);
      } else {
        groupedNotifications.push({
          title: groupTitle,
          notifications: [notification],
        });
      }
    });
    return groupedNotifications;
  };

  const groupedNotifications = groupNotificationsByDate(listNotification);
  /* handle convert switch value content */

  useEffect(() => {
    getListNotification(1);
  }, [triggerLoading]);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel('notifications');
      channel.addEventListener('message', async (event) => {
        getListNotification(1);
        setTotalParam((prev) => ({
          ...prev,
          inCreaseNotifications: 0,
        }));
      });
    } catch (error) {}
  }, []);

  /* data render popover */
  const dataRenderPopover = (
    <Row style={{ width: 400 }}>
      <Col span={24} style={{ height: 520, overflowY: 'auto', overflowX: 'hidden' }}>
        <Spin spinning={isLoading}>
          {groupedNotifications?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Col className={`${index !== 0 && 'mt-16'}`} span={24}>
                  <Row justify={'space-between'}>
                    <Typography.Text className={`notification_header-title`}>{item?.title}</Typography.Text>
                    {index === 0 && (totalParam?.totalUnread > 0 || totalParam?.inCreaseNotifications > 0) && (
                      <Typography.Text
                        // onClick={hanldeUpdateAllReadNotification}
                        className={`notification_header-mark`}
                      >
                        Đánh đấu đã đọc tất cả
                      </Typography.Text>
                    )}
                  </Row>
                </Col>
                {item?.notifications?.map((item, index) => {
                  return (
                    <Row key={index}>
                      <Col span={24} style={{ marginTop: 10 }}>
                        <Row
                          onClick={() => handleReadNotification(item)}
                          className={`notification__contain-normal  ${
                            !item?.isRead && 'notification__contain-active'
                          } `}
                          gutter={[12, 12]}
                        >
                          <Col span={23}>
                            <span>{item?.data?.title}</span>{' '}
                            <span className="d-block">
                              {item?.createdAt ? format(new Date(item?.createdAt), 'dd/MM/yyyy') : 'N/A'}
                              {' - '}
                              {item?.createdAt ? convertDate(new Date(new Date(item?.createdAt))) : 'N/A'}
                            </span>
                          </Col>
                          {!item?.isRead && <span className="notification__circle-active"></span>}
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Spin>
        <Col style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 5, marginTop: 5 }} span={24}>
          {listNotification?.length < totalParam?.totalNotification && (
            <Typography.Text onClick={loadMoreData} style={{ cursor: 'pointer', color: '#3e7af2', fontWeight: '500' }}>
              See more
            </Typography.Text>
          )}
        </Col>
      </Col>
    </Row>
  );

  return (
    <Popover
      placement="bottomRight"
      content={dataRenderPopover}
      trigger="click"
      open={clicked}
      onOpenChange={handleClickChange}
    >
      {contextHolder}
      <Badge count={totalParam?.totalUnread + totalParam?.inCreaseNotifications} overflowCount={99}>
        <img src={notificationIcon} alt="searh-icon" />
      </Badge>
    </Popover>
  );
};

export default Notification;
