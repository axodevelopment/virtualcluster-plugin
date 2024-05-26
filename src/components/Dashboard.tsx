/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title, Button, Flex, FlexItem } from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { VirtualCluster } from 'src/types';
import { Link } from 'react-router-dom';
import { Table, Thead, Tr, Th, Td, Tbody } from '@patternfly/react-table';

export interface VirtualClusterList {
  kind: string;
  apiVersion: string;
  metadata: {
    resourceVersion: string;
  };
  items: VirtualCluster[];
}

export default function ExamplePage() {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [virtualClusters, setVirtualClusters] = useState<VirtualCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const namespace = 'operator-virtualcluster';

  const version = 'Version: v1.0.p'

  useEffect(() => {
    const fetchVirtualClusters = async () => {
      console.log('Version: ' + version)
      console.log('Fetching virtual clusters...');

      try {
        const currentUrl = window.location.href;
        const currentHost = window.location.hostname;

        console.log(`currentUrl: ${currentUrl}`);
        console.log(`currentHost: ${currentHost}`);

        let newBaseURL = currentUrl.replace(
          'https://console-openshift-console',
          'https://virtualcluster-api-virtualcluster-system'
        );

        newBaseURL = newBaseURL.replace(
          '.com/virtualclusters/Dashboard',
          '.com'
        );

        newBaseURL = newBaseURL + '/virtualcluster/api/virtualcluster/' + namespace

        //TODO: REMOVE before going to actual app
        //newBaseURL = "https://virtualcluster-api-virtualcluster-system.apps.cluster-r5h9v.r5h9v.sandbox1911.opentlc.com/virtualcluster/api/virtualcluster/operator-virtualcluster"

        console.log(`Fetching data from URL: ${newBaseURL}`);

        const response = await fetch(newBaseURL, {

          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log(`Fetch response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        /*
        const responseText = await response.text();
        console.log('Response text:', responseText);

        const data = JSON.parse(responseText);
        */

        const data: VirtualClusterList = await response.json();

        console.log(Array.isArray(data.items))
        console.log(data.items)

        if (data && Array.isArray(data.items)) {
          console.log('Data fetched:', data);
          setVirtualClusters(data.items);

        } else {
          console.error('Data items is not an array or is : ', error);
          throw new Error('Data items is not an array or is undefined');
        }
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchVirtualClusters();
  }, [namespace]);

  const columns = ['Name', 'Namespace', 'VirtualMachines'];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} {version}</div>;
  }

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Dashboard')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <Title headingLevel="h1">{t('Dashboard')}</Title>
            </FlexItem>
            <FlexItem>
              <Link to="/virtualclusters/Create">
                <Button variant="primary">Create</Button>
              </Link>
            </FlexItem>
          </Flex>
        </PageSection>
        <PageSection variant="light">
            <Table>
              <Thead>
                <Tr>
                  <Th>{columns[0]}</Th>
                  <Th>{columns[1]}</Th>
                  <Th>{columns[2]}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {virtualClusters.length > 0 ? (
                virtualClusters.map((vc, index) => (
                  <Tr key={index}>
                    <Td dataLabel={vc.metadata.name}>{vc.metadata.name}</Td>
                    <Td dataLabel={vc.metadata.namespace}>{vc.metadata.namespace}</Td>
                    <Td>
                      <ul>
                        {vc.spec?.virtualMachines?.map(vm => (
                          <li key={vm}>{vm}</li> )) || <li> No virtual machines</li>}
                      </ul>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3}>No Virtual Clusters found</Td>
                </Tr>
              )}
              </Tbody>
            </Table>
        </PageSection>
      </Page>
    </>
  );
}
