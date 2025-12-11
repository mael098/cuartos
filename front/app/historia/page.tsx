"use client";

import { useEffect, useState } from "react";
import { fetchHistory, type HistoryEntry } from "@/lib/backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type RoomStats = {
    roomId: string;
    roomName: string;
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
    dataPoints: number;
    chartData: Array<{ date: string; temp: number }>;
};

export default function HistoriaPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<RoomStats[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoading(true);
                const history = await fetchHistory();

                // Agrupar por habitación
                const grouped = history.reduce(
                    (acc, entry) => {
                        if (!acc[entry.room_id]) acc[entry.room_id] = [];
                        acc[entry.room_id].push(entry);
                        return acc;
                    },
                    {} as Record<string, HistoryEntry[]>
                );

                // Calcular estadísticas
                const roomNames: Record<string, string> = {
                    room1: "Habitación Principal",
                    room2: "Sala de Estar",
                    room3: "Dormitorio",
                };

                const roomStats: RoomStats[] = Object.entries(grouped).map(
                    ([roomId, entries]) => {
                        const temps = entries.map((e) => e.temp);
                        const avgTemp =
                            temps.reduce((sum, t) => sum + t, 0) / temps.length;
                        const minTemp = Math.min(...temps);
                        const maxTemp = Math.max(...temps);

                        // Preparar datos para gráfica (últimos 30 días)
                        const chartData = entries
                            .sort(
                                (a, b) =>
                                    new Date(a.date).getTime() - new Date(b.date).getTime()
                            )
                            .map((e) => ({
                                date: new Date(e.date).toLocaleDateString("es-MX", {
                                    month: "short",
                                    day: "numeric",
                                }),
                                temp: e.temp,
                            }));

                        return {
                            roomId,
                            roomName: roomNames[roomId] || roomId,
                            avgTemp: Math.round(avgTemp * 10) / 10,
                            minTemp,
                            maxTemp,
                            dataPoints: entries.length,
                            chartData,
                        };
                    }
                );

                setStats(roomStats);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : "Error desconocido";
                setError(`No se pudo conectar al backend: ${errorMsg}. Verifica que el servidor esté corriendo en http://localhost:8080`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl font-bold mb-8">Historial Estadístico</h1>
                    <p className="text-muted-foreground">Cargando datos...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl font-bold mb-8">Historial Estadístico</h1>
                    <p className="text-red-500">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-card-foreground">
                        Historial Estadístico
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Datos del último mes por habitación
                    </p>
                </div>

                <div className="space-y-8">
                    {stats.map((room) => (
                        <Card key={room.roomId} className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-xl">{room.roomName}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Estadísticas */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">Promedio</p>
                                        <p className="text-2xl font-bold text-card-foreground">
                                            {room.avgTemp}°C
                                        </p>
                                    </div>
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">Mínima</p>
                                        <p className="text-2xl font-bold text-blue-500">
                                            {room.minTemp}°C
                                        </p>
                                    </div>
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">Máxima</p>
                                        <p className="text-2xl font-bold text-red-500">
                                            {room.maxTemp}°C
                                        </p>
                                    </div>
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">Lecturas</p>
                                        <p className="text-2xl font-bold text-card-foreground">
                                            {room.dataPoints}
                                        </p>
                                    </div>
                                </div>

                                {/* Gráfica */}
                                <div className="bg-secondary/10 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-card-foreground mb-4">
                                        Evolución de Temperatura
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={room.chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                label={{
                                                    value: "Temperatura (°C)",
                                                    angle: -90,
                                                    position: "insideLeft",
                                                }}
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="temp"
                                                stroke="#8884d8"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                name="Temperatura"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {stats.length === 0 && (
                    <Card className="bg-card border-border">
                        <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground">
                                No hay datos disponibles del último mes
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
