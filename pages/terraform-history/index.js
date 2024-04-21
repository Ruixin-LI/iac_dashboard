import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  ActionIcon,
  Badge,
  Button,
  Container,
  createStyles,
  Group,
  Modal,
  ScrollArea,
  Table,
  Title,
  Tooltip,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import Link from 'next/link';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from '@aws-amplify/auth';
import { API } from '@aws-amplify/api';
import { Amplify, Signer } from '@aws-amplify/core';

import { getData, deploy } from '../../components/invoke_api';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export async function getServerSideProps(context) {
  try {
    const { Auth, API } = withSSRContext(context);
    const user = await Auth.currentAuthenticatedUser();
    const data = await API.get('config', '/configuration', {
      headers: { Authorization: user.signInUserSession.idToken.jwtToken },
    });
    return { props: { data } };
  } catch (error) {
    return { props: { data: {} } };
  }
}

function TerraformHistory({ data }) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const deploymentData = [
    {
      createdAt: dayjs('2022-02-26 09:06:08').format('YYYY-MM-DD HH:mm:ss'),
      remarks: 'Configure data lake',
      isCurrentVersion: false,
      isDraft: true,
    },
    {
      createdAt: dayjs('2022-02-22 12:57:31').format('YYYY-MM-DD HH:mm:ss'),
      remarks: 'Add data ingress',
      isCurrentVersion: true,
      isDraft: false,
    },
    {
      createdAt: dayjs('2022-05-20 12:57:31').format('YYYY-MM-DD HH:mm:ss'),
      remarks: 'Initial data lake structure',
      isCurrentVersion: false,
      isDraft: false,
    },
  ];

  const handleDeployment = async () => {
    try {
      await deploy();
      showNotification({
        title: 'Deployment Successful',
        message: 'Terraform has been deployed successfully',
        color: 'green',
      });
      router.push('/terraform-history');
    } catch (error) {
      showNotification({
        title: 'Deployment Error',
        message: error.message || 'Failed to deploy Terraform',
        color: 'red',
      });
    }
  };

  const rows = deploymentData.map((row, id) => (
    <tr key={id}>
      <td>{row.createdAt}</td>
      <td>{row.remarks}</td>
      <td>
        <Group>
          {row.isCurrentVersion && <Badge>Current Version</Badge>}
          {row.isDraft && <Badge color='teal'>Draft</Badge>}
        </Group>
      </td>
      <td>
        <Group position='left'>
          {row.isDraft && (
            <Link href={`/terraform/${id}`}>
              <Tooltip label='Edit'><ActionIcon><IconPencil size={18} /></ActionIcon></Tooltip>
            </Link>
          )}
          {!row.isDraft && (
            <Link href={`/terraform/${id}`}>
              <Tooltip label='Duplicate'><ActionIcon><IconCopy size={18} /></ActionIcon></Tooltip>
            </Link>
          )}
          <Tooltip label='Deploy'><ActionIcon onClick={handleDeployment}><IconCloudUpload size={18} /></ActionIcon></Tooltip>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <Container style={{ flexGrow: 1 }} mt='lg'>
        <Modal
          centered
          opened={opened}
          onClose={() => setOpened(false)}
          title='Confirm Deployment'>
          <Group position='right'>
            <Button variant='outline' onClick={() => setOpened(false)}>Cancel</Button>
            <Button color='blue' onClick={handleDeployment}>Deploy</Button>
          </Group>
        </Modal>
        <Group position='apart'>
          <Title order={2}>Terraform Deployment History</Title>
          <Button onClick={() => setOpened(true)}>New Deployment</Button>
        </Group>
        <ScrollArea mt='lg' onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
          <Table sx={{ minWidth: 700 }}>
            <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
              <tr>
                <th>Created At</th>
                <th>Remarks</th>
                <th></th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Container>
    </>
  );
}

export default withAuthenticator(TerraformHistory);
