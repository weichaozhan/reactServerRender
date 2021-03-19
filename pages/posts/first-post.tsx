// import { GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import AppWrapper from '../../components/App';

import styles from './firstPost.less';

function FirstPost({
  posts
}) {

  console.log('posts', posts);

  return <div>
    <Head>
      <title>First Post</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <a className={styles['home-text']} href="/" >home</a>

    <h1>First Post</h1>
    <img src="/vercel.svg" />

    <Link href="/droutes/sd" >
      <a>
        /droutes/sd
      </a>
    </Link>
  </div>
}

export async function getStaticProps() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://zhuanlan.zhihu.com/api/articles/100076938/recommendation?include=data%5B*%5D.article.column&limit=12&offset=0')
  const posts = await res.json()
  console.log('I am getStaticProps');
  // 通过返回 { props: { posts } } 对象，Blog 组件
  // 在构建时将接收到 `posts` 参数
  return {
    props: {
      posts,
    },
  }
}

// export function getStaticPaths(): ReturnType<GetStaticPaths> {
//   return new Promise((res) => {
//     res({
//       fallback: false,
//       paths: ['/droutes/sd']
//     });
//   });
// }

export default AppWrapper(FirstPost);
