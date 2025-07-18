import Footer from "./Footer";
import Header from "./Header";

function AppLayout({ children }) {
    return (
        <>
            <Header />
            <main className="container" style={{ minHeight: '70vh' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}

export default AppLayout;