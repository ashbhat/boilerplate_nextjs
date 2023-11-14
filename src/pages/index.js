import Root from '@/components'
import Head from 'next/head'
export default function Home() {
  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="description" content="Hello World!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Root />
    </div>
  )
}
