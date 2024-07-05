export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <title>Grade Fetcher</title>
            </head>
            <body>{children}</body>
        </html>
    );
}
