import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverEndpoint } from "../../config/config";
import { DataGrid } from '@mui/x-data-grid';
import { Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
    Title
);

const formatDate = (isoDateString) => {
    if (!isoDateString) return '';

    try {
        const date = new Date(isoDateString);

        // July 10, 2025
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        console.log(error);
        return '';
    }
};

function AnalyticsDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analyticsData, setAnalyticsData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/links/analytics`, {
                params: {
                    linkId: id,
                    from: fromDate,
                    to: toDate
                },
                withCredentials: true
            });
            setAnalyticsData(response.data);
        } catch (error) {
            console.log(error);
            navigate('/error');
        }
    };

    const groupBy = (key) => {
        return analyticsData.reduce((acc, item) => {
            const label = item[key] || 'unknown';
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});
    };

    const clicksByCity = groupBy('city');
    const clicksByBrowser = groupBy('browser');

    const columns = [
        { field: 'ip', headerName: 'IP Address', flex: 1 },
        { field: 'city', headerName: 'City', flex: 1 },
        { field: 'country', headerName: 'Country', flex: 1 },
        { field: 'region', headerName: 'Region', flex: 1 },
        { field: 'isp', headerName: 'ISP', flex: 1 },
        { field: 'deviceType', headerName: 'Device', flex: 1 },
        { field: 'browser', headerName: 'Browser', flex: 1 },
        {
            field: 'clickedAt', headerName: 'Clicked At', flex: 1, renderCell: (params) => (
                <>{formatDate(params.row.clickedAt)}</>
            )
        },
    ];

    useEffect(() => {
        fetchAnalytics();
    }, [analyticsData, fromDate, toDate]);

    return (
        <div className="container" style={{ padding: '2.5rem 0', maxWidth: 1100 }}>
            <h2 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '2.1rem', marginBottom: '2rem', letterSpacing: '-1px' }}>
                Analytics for LinkID: {id}
            </h2>

            {/* Filters */}
            <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '1.5rem 2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1.1rem', marginRight: 18 }}>Filters:</div>
                <div style={{ minWidth: 180 }}>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        className="form-control"
                        placeholderText="From (Date)"
                        style={{ width: '100%', padding: '0.6em 1em', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                    />
                </div>
                <div style={{ minWidth: 180 }}>
                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        className="form-control"
                        placeholderText="To (Date)"
                        style={{ width: '100%', padding: '0.6em 1em', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                    />
                </div>
            </div>

            {/* Charts */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <div style={{ flex: '2 1 400px', background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '2rem', minWidth: 320 }}>
                    <h4 style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: 12 }}>Clicks by City</h4>
                    <Bar
                        data={{
                            labels: Object.keys(clicksByCity),
                            datasets: [
                                {
                                    label: 'Clicks',
                                    data: Object.values(clicksByCity),
                                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                                }
                            ]
                        }}
                        options={{ responsive: true }}
                    />
                </div>
                <div style={{ flex: '1 1 260px', background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '2rem', minWidth: 260 }}>
                    <h4 style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: 12 }}>Clicks by Browser</h4>
                    <Pie
                        data={{
                            labels: Object.keys(clicksByBrowser),
                            datasets: [
                                {
                                    data: Object.values(clicksByCity),
                                    backgroundColor: [
                                        'var(--primary)',
                                        'var(--accent)',
                                        '#FFCE56',
                                        '#4BC0C0',
                                        '#9966FF',
                                        '#FF9F40',
                                    ],
                                }
                            ]
                        }}
                        options={{ responsive: true }}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '2rem', marginBottom: '2rem' }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={analyticsData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 20, page: 0 }
                        }
                    }}
                    pageSizeOptions={[20, 50, 100]}
                    disableRowSelectionOnClick
                    showToolbar
                    sx={{
                        fontFamily: 'inherit',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text)',
                        '.MuiDataGrid-columnHeaders': {
                            background: 'var(--background)',
                            color: 'var(--primary-dark)',
                            fontWeight: 700,
                            fontSize: '1.05rem',
                        },
                        '.MuiDataGrid-row': {
                            background: '#fff',
                        },
                        '.MuiDataGrid-cell': {
                            borderBottom: '1px solid var(--border)',
                        },
                        '.MuiDataGrid-footerContainer': {
                            background: 'var(--background)',
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default AnalyticsDashboard;