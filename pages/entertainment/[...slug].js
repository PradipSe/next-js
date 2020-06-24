import Link from 'next/link'

export default function A() {
    return (
      <div>
        <h1>A</h1>
        <Link href="/entertainment">
          <p>Home</p>
        </Link>
      </div>
    )
}
  