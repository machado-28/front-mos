import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CChart } from '@coreui/react-chartjs';
import { Box, CircularProgress } from '@mui/material';

const EstatisticasVistos = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/v1/processos/estatisticas/mensais');
                setData(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados de estatísticas', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const chartData = {
        labels: Object.keys(data),
        datasets: Object.keys(data).map((month) => ({
            label: month,
            data: data[month].map(item => item.count),
            backgroundColor: data[month].map((_, index) =>
                index % 2 === 0 ? '#36A2EB' : '#FF6384'
            ),
        }))
    };

    return (
        <Box m={4}>
            <CChart
                type="doughnut"
                data={chartData}
                options={{
                    plugins: {
                        legend: {
                            labels: {
                                color: '#000',
                            }
                        }
                    },
                }}
            />
        </Box>
    );
};

export default EstatisticasVistos;
