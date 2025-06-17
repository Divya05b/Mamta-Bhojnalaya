import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    deliveryAddress?: string;
    specialInstructions?: string;
}

const OrderTrackingPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
                if (!response.ok) throw new Error('Failed to fetch order details');
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!order) return <Alert severity="info">Order not found.</Alert>;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Order #{order.id}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Status: {order.status}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Customer: {order.customerName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Email: {order.customerEmail}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Phone: {order.customerPhone}
                </Typography>
                {order.deliveryAddress && (
                    <Typography variant="subtitle1" gutterBottom>
                        Address: {order.deliveryAddress}
                    </Typography>
                )}
                <Typography variant="subtitle1" gutterBottom>
                    Items:
                </Typography>
                {order.items.map(item => (
                    <Typography key={item.id}>
                        {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                ))}
                <Typography variant="subtitle1" gutterBottom>
                    Total: ₹{order.total.toFixed(2)}
                </Typography>
                {order.specialInstructions && (
                    <Typography variant="subtitle1" gutterBottom>
                        Special Instructions: {order.specialInstructions}
                    </Typography>
                )}
                <Typography variant="subtitle1" gutterBottom>
                    Created: {new Date(order.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Last Updated: {new Date(order.updatedAt).toLocaleString()}
                </Typography>
            </Paper>
        </Box>
    );
};

export default OrderTrackingPage; 