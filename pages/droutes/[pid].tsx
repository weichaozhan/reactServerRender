import React, { FC, useState } from 'react';
import AppWrapper from '../../components/App';
import { useRouter } from 'next/router';

const testPid: FC<any> = ({
  data
}) => {
  const router = useRouter();
  const { pid } = router.query;

  const [count, setCount] = useState<number>(1);

  console.log('props', data);
  return <div>
    <h1>
      pid:{pid}
    </h1>

    <h2>
      count: {count}
    </h2>
    <button onClick={() => setCount(count + 1)} >
      Upgrade Count
    </button>
  </div>
};

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://zhuanlan.zhihu.com/api/articles/100076938/recommendation?include=data%5B*%5D.article.column&limit=12&offset=0`)
  const data = await res.json();
  console.log('I am getServerSideProps');
  // Pass data to the page via props
  return { props: { data } }
}

export default AppWrapper(testPid);
