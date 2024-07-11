/* eslint-disable @typescript-eslint/no-unused-vars */
import employeeLogo from '@/assets/img/employee_logo.png';
import revenueLogo from '@/assets/img/revenue_logo.png';
import schoolLogo from '@/assets/img/school_logo.png';
import { Breadcrumb, Container, SelectUI } from '@/components';
import useLoading from '@/hooks/useLoading';
import { IRevenueList } from '@/models/revenue.model';
import { getListRevenueAPI } from '@/services/api/revenue';
import { Card, Flex, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import './Dashboard.scss';
import { formatVietnameseCurrency, generateNextTenYears } from './utils';

const DashboardManagement: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [overallData, setOverallData] = useState<IRevenueList>({
    dataChartInstall: [],
    dataChartMaintenance: [],
    schools: 0,
    staffs: 0,
    installRecords: 0,
    maintenances: 0,
    totalInstallRecord: 0,
    totalMaitenance: 0,
  });

  const { isLoading, withLoading } = useLoading();

  const fetchDataRevenue = (year: number | string) => {
    withLoading(async () => {
      const response = await getListRevenueAPI({ year });
      setOverallData(response?.data);
    });
  };

  useEffect(() => {
    Promise.all([fetchDataRevenue(currentYear)]);
  }, [currentYear]);

  return (
    <Row className="contract-management_container">
      <Breadcrumb title="Tổng Quan" />
      <Container className="info-container">
        <Spin spinning={isLoading}>
          <Flex justify="center" gap="2rem">
            <Card>
              <Row className="info-card">
                <Row className="info-card-text">
                  <Typography>Tổng số trường</Typography>
                  <Typography>{overallData.schools}</Typography>
                </Row>
                <img src={schoolLogo} alt="school-icon" />
              </Row>
            </Card>
            <Card>
              <Row className="info-card">
                <Row className="info-card-text">
                  <Typography>Tổng số nhân viên</Typography>
                  <Typography>{overallData.staffs}</Typography>
                </Row>
                <img src={employeeLogo} alt="employee-icon" />
              </Row>
            </Card>
            <Card>
              <Row className="info-card">
                <Row className="info-card-text">
                  <Typography>Tổng doanh thu năm {currentYear} (VNĐ)</Typography>
                  <Typography>{formatVietnameseCurrency(overallData.totalInstallRecord)}</Typography>
                </Row>
                <img src={revenueLogo} alt="revenue-icon" />
              </Row>
            </Card>
          </Flex>
        </Spin>
      </Container>

      <Container className="chart-container">
        <Spin size="large" spinning={isLoading}>
          <Row justify="space-between">
            <Typography.Title level={3}>Doanh thu các tháng năm {currentYear}</Typography.Title>
            <SelectUI
              placeholder={currentYear}
              className="select-year"
              options={generateNextTenYears()}
              onChange={(y) => setCurrentYear(y)}
            />
          </Row>
          {overallData.dataChartInstall.length ? (
            <Chart dataChart={overallData.dataChartInstall} />
          ) : (
            <Flex justify="center">
              <Typography.Paragraph>Không có dữ liệu doanh thu của năm {currentYear}</Typography.Paragraph>
            </Flex>
          )}
        </Spin>
      </Container>
    </Row>
  );
};

export default React.memo(DashboardManagement);
