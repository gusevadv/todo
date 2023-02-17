import './globals.css'

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body className="bg-[#e0e0e0]">
        {props.children}
      </body>
    </html>
  )
}
