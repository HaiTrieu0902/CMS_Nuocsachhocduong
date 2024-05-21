import { useModel } from '@umijs/max';
import { Typography } from 'antd';
import React, { useEffect } from 'react';
import './Dashboard.scss';

const DashboardManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  /* Inittial value for root app */
  useEffect(() => {
    setInitialState((s: any) => ({
      ...s,
      data: 'TRANG CHỦ',
    }));
  });

  return <Typography>Dashboard</Typography>;
};

export default React.memo(DashboardManagement);
