import { Layout, Menu } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Header, Sider, Content } = Layout;
const MenuItem = Menu.Item;

const AppWrapper = (Page) => {
  const cmHandled = (props) => {
    const router = useRouter();

    return <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <h1 style={{ color: '#fff', textAlign: 'center' }} >
          I am header
        </h1>
      </Header>
      <Layout>
        <Sider>
          <Menu
            defaultSelectedKeys={[router.route]}
            mode="inline"
          >
            <MenuItem key="/" >
              <Link href="/" >home</Link>
            </MenuItem>

            <MenuItem key="/posts/first-post" >
              <Link href="/posts/first-post" >first-post</Link>
            </MenuItem>
          </Menu>
        </Sider>

        <Content>
          <Page {...props} />
        </Content>
      </Layout>
    </Layout>;

  };

  return cmHandled;
}

export default AppWrapper;
