import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../../config/config";

function formatDate(isoDateString) {
    if (!isoDateString) return '';

    try {
        const date = new Date(isoDateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    } catch (error) {
        console.error('Invalid date:', isoDateString);
        return '';
    }
}

function Subscription() {
    const userDetails = useSelector((state) => state.userDetails);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    const subscription = userDetails.subscription;

    const handleCancel = async () => {
        try {
            const response = await axios.post(`${serverEndpoint}/payments/cancel-subscription`, {
                subscription_id: userDetails.subscription?.id
            }, {
                withCredentials: true
            });

            console.log(response);
            setMessage('Subscription cancelled, it can take up to 5 minutes to reflect the status');
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to cancel subscription' });
        }
    };

    return (
        <div style={{ background: 'var(--background)', minHeight: '80vh', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: 500 }}>
                {errors.message && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #fecaca' }}>{errors.message}</div>}
                {message && <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #6ee7b7' }}>{message}</div>}

                <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '2.5rem 2rem', margin: '0 auto' }}>
                    <h2 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '1.7rem', marginBottom: 16, textAlign: 'center' }}>Subscription Summary</h2>
                    <hr style={{ borderColor: 'var(--border)' }} />
                    <div style={{ color: 'var(--text)', fontSize: '1.08rem', marginBottom: 18 }}>
                        <div style={{ paddingBottom: 8 }}><strong>Start Date:</strong> {formatDate(subscription.start)}</div>
                        <div style={{ paddingBottom: 8 }}><strong>End Date:</strong> {formatDate(subscription.end)}</div>
                        <div style={{ paddingBottom: 8 }}><strong>Last Payment Date:</strong> {formatDate(subscription.lastBillDate)}</div>
                        <div style={{ paddingBottom: 8 }}><strong>Next Payment Date:</strong> {formatDate(subscription.nextBillDate)}</div>
                        <div style={{ paddingBottom: 8 }}><strong>Total Payments Made:</strong> {subscription.paymentsMade}</div>
                        <div style={{ paddingBottom: 8 }}><strong>Payments Remaining:</strong> {subscription.paymentsRemaining}</div>
                    </div>
                    <hr style={{ borderColor: 'var(--border)' }} />
                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7em 2em', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => handleCancel()}>
                            Cancel Subscription
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subscription;