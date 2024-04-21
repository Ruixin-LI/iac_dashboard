import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Modal,
  NavLink,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from '@aws-amplify/auth';
import { API } from '@aws-amplify/api';
import { Amplify, Signer } from '@aws-amplify/core';

import { deploy, saveConfig } from '../../../components/invoke_api';

const sampleJSON = {
  username: 'pixels-admin-testing',
  configType: 's3_bucket',
  overrideId: 'be0cb75c-484d-4374-a165-0baad79068de',
  content: {
    resourceName: 'overrided',
    bucketName: 'test_55aa8f4115ac',
    bucketPrefix: 'test_7d2c19e120e6',
    forceDestroy: false,
    objectLockEnabled: false,
    tags: {
      ResourceGroup: 'whatever',
      AnotherTag: 'well this seems nice',
    },
  },
};

function CreateTerraform() {
  const form = useForm({ initialValues: sampleJSON });
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);

  const handleDeployment = async () => {
    setModalOpened(false);
    try {
      await saveConfig(form.values);
      await deploy();
      showNotification({
        title: 'Deployment Successful',
        message: 'Your Terraform configuration has been deployed successfully.',
        color: 'green',
      });
      router.push('/terraform-history');
    } catch (error) {
      showNotification({
        title: 'Deployment Error',
        message: error.message || 'Failed to deploy Terraform configuration.',
        color: 'red',
      });
    }
  };

  const handleSaveConfig = async () => {
    try {
      await saveConfig(form.values);
      showNotification({
        title: 'Save Successful',
        message: 'Your Terraform configuration has been saved successfully.',
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Saving Error',
        message: error.message || 'Failed to save Terraform configuration.',
        color: 'red',
      });
    }
  };

  return (
    <form style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Modal
        centered
        opened={modalOpened}
        withCloseButton={true}
        onClose={() => setModalOpened(false)}
        title='Are you sure you want to deploy this configuration?'>
        <Group position='right'>
          <Button variant='outline' onClick={() => setModalOpened(false)}>Cancel</Button>
          <Button color='blue' onClick={handleDeployment}>Deploy</Button>
        </Group>
      </Modal>

      <Container p='lg' fluid style={{ flexGrow: 1, display: 'flex', gap: '1em' }}>
        <Card shadow='sm' p='lg' radius='md' withBorder style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
          <Stack>
            <NavLink label='S3 Bucket' description={<><Text>Size: 123TB</Text><Text>Name: Datalake</Text></>}/>
            <NavLink label='Ingest Station' description={<><Text>Bandwidth: 1GB/s</Text><Text>Name: FTP Service</Text></>}/>
            <Tooltip label='Add New Resource'>
              <Button variant='outline' onClick={() => console.log('Add new resource')}><IconPlus /></Button>
            </Tooltip>
          </Stack>
          <div style={{ flexGrow: 1 }} />
          <Group grow>
            <Button variant='outline' color='blue' mt='md' radius='md' onClick={handleSaveConfig}>Save</Button>
            <Button variant='light' color='yellow' mt='md' radius='md' onClick={() => setModalOpened(true)}>Deploy</Button>
          </Group>
        </Card>
        <Card shadow='sm' p='lg' radius='md' withBorder style={{ flexGrow: 1 }}>
          <Stack>
            <TextInput label='Username' disabled {...form.getInputProps('username')}/>
            <TextInput label='Resource Name' {...form.getInputProps('content.resourceName')}/>
            <Select label='Resource Type' placeholder='Pick one' {...form.getInputProps('configType')} data={[{ value: 's3_bucket', label: 'S3 Bucket' }]}/>
            <TextInput label='Override ID' {...form.getInputProps('overrideId')}/>
            <TextInput label='Service Name' {...form.getInputProps('content.bucketName')}/>
            <TextInput label='Bucket Prefix' {...form.getInputProps('content.bucketPrefix')}/>
            <Checkbox label='Force Destroy' {...form.getInputProps('content.forceDestroy')}/>
            <Checkbox label='Object Lock Enabled' {...form.getInputProps('content.objectLockEnabled')}/>
            <TextInput label='Resource Group' {...form.getInputProps('content.tags.ResourceGroup')}/>
            <TextInput label='Another Tag' {...form.getInputProps('content.tags.AnotherTag')}/>
          </Stack>
        </Card>
      </Container>
    </form>
  );
}

export default withAuthenticator(CreateTerraform);
