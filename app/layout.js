export const metadata = {
  title: 'Pomodoro Timer',
  description: 'A simple and elegant Pomodoro timer to boost your productivity',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
