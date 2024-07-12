/* eslint-disable @typescript-eslint/no-unused-vars */
import employeeLogo from '@/assets/img/employee_logo.png';
import revenueLogo from '@/assets/img/revenue_logo.png';
import schoolLogo from '@/assets/img/school_logo.png';
import { Breadcrumb, Container, SelectUI } from '@/components';
import useLoading from '@/hooks/useLoading';
import { IRevenueList } from '@/models/revenue.model';
import { getListRevenueAPI } from '@/services/api/revenue';
import { TruckOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
//import * as XLSX from 'xlsx';
import XLSX from 'xlsx-js-style';
import Chart from './Chart';
import './Dashboard.scss';
import {
  alternateRowStyle,
  formatVietnameseCurrency,
  generateNextTenYears,
  headerStyle,
  rowStyle,
  totalStyle,
} from './utils';
const DashboardManagement: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [typeRevenue, setTypeRevenue] = useState<string>('product');
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

  const fetchDataRevenue = (year: number | string, type: string) => {
    withLoading(async () => {
      const response = await getListRevenueAPI({ year, type });
      setOverallData(response?.data);
    });
  };

  const generateXLSXFile = async (data: IRevenueList, filename: string) => {
    try {
      const rows =
        typeRevenue === 'product'
          ? [
              ...data.dataChartInstall.map((row: any) => ({
                month: row.month,
                type: 'Hồ sơ lắp đặt',
                total: row.total,
              })),
            ]
          : [
              ...data.dataChartInstall.map((row: any) => ({
                month: row.month,
                type: 'Hồ sơ lắp đặt',
                total: row.total,
              })),
              ...data.dataChartMaintenance.map((row: any) => ({
                month: row.month,
                type: 'Sửa chữa',
                total: row.total,
              })),
            ];
      const totalInstall = data.dataChartInstall.reduce((sum, record) => sum + record.total, 0);
      const totalMaintenance = data.dataChartMaintenance.reduce((sum, record) => sum + record.total, 0);

      rows.push({
        month: typeRevenue === 'product' ? 'Tổng thiết bị lắp đặt' : 'Tổng doanh thu',
        type: '',
        total: typeRevenue === 'product' ? totalInstall : totalInstall + totalMaintenance,
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Revenue Data');
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [['Tháng', 'Loại', typeRevenue === 'product' ? 'Số lượng thiết bị lắp' : 'Tổng tiền tháng']],
        { origin: 'A1' },
      );

      const max_width = {
        month: rows.reduce((w: any, r: any) => Math.max(w, r?.month && r.month.toString().length), 10),
        type: rows.reduce((w: any, r: any) => Math.max(w, r?.type && r.type.length), 10),
        total: rows.reduce((w: any, r: any) => Math.max(w, r?.total && r.total.toString().length), 10),
      };
      worksheet['!cols'] = [{ wch: max_width.month }, { wch: max_width.type }, { wch: max_width.total }];

      // Apply styles
      worksheet['A1'].s = headerStyle;
      worksheet['B1'].s = headerStyle;
      worksheet['C1'].s = headerStyle;

      for (let R = 1; R <= rows.length; R++) {
        for (let C = 0; C < 3; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = R % 2 === 0 ? rowStyle : alternateRowStyle;
        }
      }

      // Apply total style to the last row
      for (let C = 0; C < 3; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rows.length, c: C });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = totalStyle;
        }
      }

      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error generating XLSX file:', error);
    }
  };
  const handleExportALlDataXLSX = async () => {
    withLoading(async () => {
      await generateXLSXFile(overallData, 'RevenueReport.xlsx');
    });
  };

  useEffect(() => {
    Promise.all([fetchDataRevenue(currentYear, typeRevenue)]);
  }, [currentYear, typeRevenue]);

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
                  <Typography>
                    {typeRevenue === 'product'
                      ? `Tổng thiết bị đã lắp đặt ${currentYear}`
                      : `Tổng doanh thu năm ${currentYear} VNĐ`}
                  </Typography>
                  <Typography>
                    {formatVietnameseCurrency(
                      typeRevenue === 'product'
                        ? overallData.totalInstallRecord
                        : overallData.totalInstallRecord + overallData?.totalMaitenance,
                    )}
                  </Typography>
                </Row>
                {typeRevenue === 'product' ? (
                  <Row
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      height: 61,
                      width: 61,
                      backgroundColor: '#0d6cf2',
                      borderRadius: 999,
                    }}
                  >
                    <TruckOutlined style={{ color: 'white', fontSize: 28 }} />
                  </Row>
                ) : (
                  <img src={revenueLogo} alt="revenue-icon" />
                )}
              </Row>
            </Card>
          </Flex>
        </Spin>
      </Container>

      <Container className="chart-container">
        <Spin size="large" spinning={isLoading}>
          <Row justify="space-between">
            <Typography.Title level={3}>
              {typeRevenue === 'product' ? 'Thiết bị đã lắp đặt trong năm' : 'Doanh thu các tháng năm'} {currentYear}
            </Typography.Title>
            <Row style={{ gap: 12 }}>
              <Button onClick={handleExportALlDataXLSX} style={{ width: 120 }} className="btn btn-add">
                Xuất báo cáo
              </Button>
              <SelectUI
                style={{ width: 120 }}
                defaultValue={'product'}
                options={[
                  {
                    value: 'product',
                    label: 'Thiết bị',
                  },
                  {
                    value: 'revenue',
                    label: 'Doanh thu',
                  },
                ]}
                onChange={(type) => setTypeRevenue(type)}
              />
              <SelectUI
                placeholder={currentYear}
                className="select-year"
                options={generateNextTenYears()}
                onChange={(y) => setCurrentYear(y)}
              />
            </Row>
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
