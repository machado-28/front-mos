//StepProgress.js
import React, { useEffect, useState } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, MarkSeries } from 'react-vis';
import 'react-vis/dist/style.css';


export default function StepProgress() {
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === 'p') {
                event.preventDefault(); // Impede a ação padrão do navegador
                fetch('/status')
                    .then(response => response.json())
                    .then(data => {
                        setStatusData(data.steps);
                    })
                    .catch(error => console.error('Error fetching status data:', error));
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'aprovado':
                return 'green';
            case 'recusado':
                return 'red';
            case 'finalizado':
                return 'blue';
            default:
                return 'grey';
        }
    };

    const timelineData = statusData.map((step, index) => ({
        x: new Date(step.date),
        y: index + 1,
        label: step.name,
        color: getStatusColor(step.status)
    }));

    return (
        <div>
            <h1>Pressione Ctrl + P para visualizar o progresso do pedido</h1>
            {statusData.length > 0 && (
                <div>
                    <XYPlot height={300} width={600} xType="time">
                        <HorizontalGridLines />
                        <XAxis title="Data" />
                        <YAxis title="Etapas" />
                        <LineSeries data={timelineData} curve={'curveMonotoneX'} />
                        <MarkSeries data={timelineData} />
                    </XYPlot>
                    {statusData.map((step, index) => (
                        <div key={index} style={{ marginTop: '10px' }}>
                            <h3>{step.name}</h3>
                            <p>Status: <span style={{ color: getStatusColor(step.status) }}>{step.status}</span></p>
                            <p>Data: {formatDate(step.date)}</p>
                            <p>Nota: {step.note}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};



