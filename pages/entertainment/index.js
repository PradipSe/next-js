import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="entertainment/category/subCategory/abc">
          <p>Dynamic Slugs</p>
        </Link>
      </li>
      <li>
        <Link href="entertainment/tag/abc">
          <p>Tag</p>
        </Link>
      </li>
      <li>
        <Link href="entertainment/author/abc">
          <p>Author</p>
        </Link>
      </li>
    </ul>
  )
}

export default Home