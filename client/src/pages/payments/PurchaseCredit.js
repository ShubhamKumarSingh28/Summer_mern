import { useDispatch, useSelector } from "react-redux";
import { CREDIT_PACKS, PLAN_IDS, pricingList } from "../../config/payments";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { SET_USER } from "../../redux/user/actions";
import './PurchaseCredit.css';
import { Modal } from "react-bootstrap";

function PurchaseCredit() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleBuyCredits = async (credits) => {
        setShowModal(false);
        try {
            const { data } = await axios.post(`${serverEndpoint}/payments/create-order`, {
                credits
            }, { withCredentials: true });

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Affiliate++',
                description: `${credits} Credits Pack`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const { data } = await axios.post(`${serverEndpoint}/payments/verify-order`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            credits
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: data
                        });
                        setMessage(`${credits} credits added!`);
                    } catch (error) {
                        console.error(error);
                        setErrors({ message: 'Unable to purchase credits, please try again' });
                    }
                },
                theme: { color: '#3399cc' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Unable to purchase credits, please try again' });
        }
    };

    const handleSubscribe = async (planKey) => {
        try {
            const { data } = await axios.post(`${serverEndpoint}/payments/create-subscription`, {
                plan_name: planKey
            }, { withCredentials: true });

            const plan = PLAN_IDS[planKey];
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                name: plan.planName,
                description: plan.description,
                subscription_id: data.subscription.id,
                handler: async function (response) {
                    try {
                        const user = await axios.post(`${serverEndpoint}/payments/verify-subscription`, {
                            subscription_id: response.razorpay_subscription_id
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: user.data
                        });
                        setMessage('Subscription activated');
                    } catch (error) {
                        setErrors({ message: 'Unable to activate subscription, please try again' });
                    }
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Failed to create subscription' });
        }
    };

    return (
        <section style={{ background: 'var(--background)', minHeight: '80vh', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: 1100 }}>
                {errors.message && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #fecaca' }}>{errors.message}</div>}
                {message && <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #6ee7b7' }}>{message}</div>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '2rem', marginBottom: 8 }}>Choose Plan</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', margin: 0 }}>Flexible options: one-time credits or recurring subscriptions.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h3 style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: 0 }}>Current Balance</h3>
                        <p style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700 }}>{userDetails.credits} Credits</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Credit Pack Card */}
                    <div style={{ flex: '1 1 300px', maxWidth: 340, background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.2rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>Credit Packs</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.2rem 0', color: 'var(--text-light)', fontSize: '1.05rem' }}>
                            {CREDIT_PACKS.map(c => (
                                <li style={{ paddingBottom: 6 }} key={c}>
                                    {c} CREDITS FOR ₹{c}
                                </li>
                            ))}
                        </ul>
                        <button className="cta-btn" onClick={() => setShowModal(true)}>
                            Buy Credits
                        </button>
                    </div>

                    {/* Monthly Plan */}
                    <div style={{ flex: '1 1 300px', maxWidth: 340, background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.2rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>₹199/month</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.2rem 0', color: 'var(--text-light)', fontSize: '1.05rem' }}>
                            {pricingList[1].list.map((item, i) => (
                                <li style={{ paddingBottom: 6 }} key={i}>{item.detail}</li>
                            ))}
                        </ul>
                        <button className="cta-btn" onClick={() => handleSubscribe('UNLIMITED_MONTHLY')}>
                            Subscribe Monthly
                        </button>
                    </div>

                    {/* Yearly Plan */}
                    <div style={{ flex: '1 1 300px', maxWidth: 340, background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.2rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>₹1990/year</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.2rem 0', color: 'var(--text-light)', fontSize: '1.05rem' }}>
                            {pricingList[2].list.map((item, i) => (
                                <li style={{ paddingBottom: 6 }} key={i}>{item.detail}</li>
                            ))}
                        </ul>
                        <button className="cta-btn" onClick={() => handleSubscribe('UNLIMITED_YEARLY')}>
                            Subscribe Yearly
                        </button>
                    </div>
                </div>

                {/* Modal for buying credits */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Buy Credits</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {CREDIT_PACKS.map((c) => (
                            <button
                                key={c}
                                style={{ margin: 8, border: '1.5px solid var(--primary)', color: 'var(--primary)', background: '#fff', borderRadius: 8, padding: '0.6em 1.4em', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => handleBuyCredits(c)}
                            >
                                Buy {c} Credits
                            </button>
                        ))}
                    </Modal.Body>
                </Modal>
            </div>
        </section>
    );
}

export default PurchaseCredit;
