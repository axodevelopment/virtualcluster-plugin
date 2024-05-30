/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title, Button, Flex, FlexItem, Label, List, ListItem, DescriptionListGroup, DescriptionListTerm, DescriptionListDescription, BackToTop} from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { VirtualCluster, VirtualClusterList } from 'src/types';
import { Link } from 'react-router-dom';
import {PlusCircleIcon} from '@patternfly/react-icons';
import { Table, Thead, Tr, Th, Td, Tbody } from '@patternfly/react-table';



export default function ExamplePage() {
  const { t } = useTranslation('plugin__my-openshift-console-plugin-template');

  const [virtualClusters, setVirtualClusters] = useState<VirtualCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const version = 'Version: v1.0.r'

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

        // Dashboard shoudl just query all vc's
        newBaseURL = newBaseURL + '/virtualcluster/api/virtualclusters'

        //TODO: REMOVE before going to actual app
        //newBaseURL = "https://virtualcluster-api-virtualcluster-system.apps.cluster-gfpzv.gfpzv.sandbox2794.opentlc.com/virtualcluster/api/virtualclusters"

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
  }, []);
  //need to look at what dependency would make sense here
  // thinking sse to force requery if a new vc gets added or something

  const columns = ['Name', 'Namespace', 'Labels', 'Selectors', 'VirtualMachines'];

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
                  <Th>{columns[3]}</Th>
                  <Th>{columns[4]}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {virtualClusters.length > 0 ? (
                virtualClusters.map((vc, index) => (
                  <Tr key={index}>
                    <Td dataLabel={vc.metadata.name} ><div style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#007BFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          marginRight: '10px'
                        }}>
                          VC
                        </div>
                        {vc.metadata.name}
                      </div></Td>
                    <Td dataLabel={vc.metadata.namespace}>{vc.metadata.namespace}</Td>
                    <Td>
                      {vc.metadata.labels ? (
                        Object.entries(vc.metadata.labels).map(([key, value]) => (
                          <Label key={key} color="blue">
                            {key}: {value}
                          </Label>
                        ))
                      ) : (
                        <span> </span>
                      )}
                    </Td>
                    <Td>
                      {vc.spec?.nodeSelector?.labels ? (
                          Object.entries(vc.spec?.nodeSelector.labels).map(([key, value]) => (
                            <Label key={key} color="orange">
                              {key}: {value}
                            </Label>
                          ))
                        ) : (
                        <span>*</span>
                      )}
                    </Td>
                    <Td>
                      <List isPlain>
                        {vc.spec?.virtualMachines?.map(vm => (
                          <ListItem key={vm.name}>
                            <div>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Virtual Machine Selector</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Button
                                    variant="link"
                                    isInline
                                    icon={<PlusCircleIcon />}
                                    onClick={() => window.location.href = `/k8s/ns/${vm.namespace}/kubevirt.io~v1~VirtualMachine/${vm.name}`}
                                  >
                                    {vm.name} in {vm.namespace}
                                  </Button>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </div>
                          </ListItem>
                        )) || <ListItem>*</ListItem>}
                      </List>
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
        <BackToTop isAlwaysVisible />
      </Page>
    </>
  );
}
