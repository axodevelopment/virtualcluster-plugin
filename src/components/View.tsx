/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import {
  Button,
  Flex,
  FlexItem,
  Page,
  PageSection,
  Title,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider,
  Tabs,
  Tab,
  TabTitleText,
  Label,
} from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { VirtualCluster } from 'src/types';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { Table, Thead, Tr, Th, Td, Tbody } from '@patternfly/react-table';

export default function ViewPage() {
  const location = useLocation<{ namespace: string; name: string }>();
  const { namespace, name } = location.state;
  const [error, setError] = useState<string | null>(null);
  const [virtualCluster, setVirtualCluster] = useState<VirtualCluster>();
  const [isLoading, setIsLoading] = useState(true);
  const version = 'Version: 1.0.a';

  const history = useHistory();

  useEffect(() => {
    const fetchVirtualCluster = async () => {
      console.log('Version: ' + version);
      console.log('Fetching virtual clusters...');

      try {
        const currentUrl = window.location.href;
        const currentHost = window.location.hostname;

        console.log(`currentUrl: ${currentUrl}`);
        console.log(`currentHost: ${currentHost}`);

        let newBaseURL = currentUrl.replace(
          'https://console-openshift-console',
          'https://virtualcluster-api-virtualcluster-system',
        );

        newBaseURL = newBaseURL.replace('.com/virtualclusters/View', '.com');

        const routeUrl =
          '/virtualcluster/api/virtualclusters/' + namespace + '/' + name;

        ///virtualcluster/api/virtualclusters/:namespace/:name
        newBaseURL = newBaseURL + routeUrl;

        //TODO: REMOVE before going to actual app
        newBaseURL =
          'https://virtualcluster-api-virtualcluster-system.apps.cluster-gfpzv.gfpzv.sandbox2794.opentlc.com' +
          routeUrl;

        console.log(`Fetching data from URL: ${newBaseURL}`);

        const response = await fetch(newBaseURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`Fetch response status: ${response.status}`);

        if (response.status == 404) {
          history.push('/virtualclusters/Dashboard');
        }

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`,
          );
        }

        const data: VirtualCluster = await response.json();

        console.log('Data Fetched: ', data);
        setVirtualCluster(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }

      setIsLoading(false);
    };

    fetchVirtualCluster();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error} {version}
      </div>
    );
  }

  return (
    <Page>
      <PageSection variant="light">
        <Title headingLevel="h1">
          Editing <u>{name}</u> in the {namespace} namespace
        </Title>
        {/* Your edit form or content goes here */}
      </PageSection>
      <Divider />
      <PageSection variant="light">
        <div>
          <Tabs
            // tabs for future
            //activeKey={activeTabKey}
            //onSelect={handleTabClick}
            aria-label="Tabs in the default example"
            role="region"
          >
            <Tab
              eventKey={0}
              title={<TabTitleText>Details</TabTitleText>}
              aria-label="Default content - users"
            ></Tab>
            <Tab
              eventKey={1}
              title={<TabTitleText>Networking</TabTitleText>}
              isDisabled
            >
              More
            </Tab>
          </Tabs>
        </div>
      </PageSection>
      <PageSection variant="light">
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Name</DescriptionListTerm>
            <DescriptionListDescription>
              {virtualCluster?.metadata?.name}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Namespace</DescriptionListTerm>
            <DescriptionListDescription>
              <a href="#">{virtualCluster?.metadata?.namespace}</a>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Labels</DescriptionListTerm>
            <DescriptionListDescription>
              {virtualCluster?.metadata?.labels ? (
                Object.entries(virtualCluster.metadata.labels).map(
                  ([key, value]) => (
                    <Label key={key} color="blue">
                      {key}: {value}
                    </Label>
                  ),
                )
              ) : (
                <span> </span>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Node Labels</DescriptionListTerm>
            <DescriptionListDescription>
              {virtualCluster.spec?.nodeSelector?.labels ? (
                Object.entries(virtualCluster.spec?.nodeSelector.labels).map(
                  ([key, value]) => (
                    <Label key={key} color="orange">
                      {key}: {value}
                    </Label>
                  ),
                )
              ) : (
                <span>*</span>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Annotation</DescriptionListTerm>
            <DescriptionListDescription>*</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>
      <Divider />
      <PageSection>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Namespace</Th>
              <Th>Selector</Th>
              <Th>Node Labels</Th>
            </Tr>
          </Thead>
          <Tbody>
            {virtualCluster.spec?.virtualMachines?.length > 0 ? (
              virtualCluster.spec.virtualMachines.map((vm, index) => (
                <Tr key={index}>
                  <Td dataLabel={vm.name}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#007BFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          marginRight: '10px',
                        }}
                      >
                        VM
                      </div>
                      {vm.name}
                    </div>
                  </Td>
                  <Td>{vm.namespace}</Td>
                  <Td>
                    <Button
                      variant="link"
                      isInline
                      icon={<PlusCircleIcon />}
                      onClick={() =>
                        (window.location.href = `/k8s/ns/${vm.namespace}/kubevirt.io~v1~VirtualMachine/${vm.name}`)
                      }
                    >
                      {vm.name}
                    </Button>{' '}
                    in <b>{vm.namespace}</b>
                  </Td>
                  <Td>
                    {virtualCluster.spec?.nodeSelector?.labels ? (
                      Object.entries(
                        virtualCluster.spec?.nodeSelector.labels,
                      ).map(([key, value]) => (
                        <Label key={key} color="orange">
                          {key}: {value}
                        </Label>
                      ))
                    ) : (
                      <span>*</span>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <span> </span>
            )}
          </Tbody>
        </Table>
      </PageSection>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: 'white',
          padding: '1rem',
          borderTop: '1px solid #ddd',
          boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
          zIndex: 1000, // Ensure it stays on top of other elements
        }}
      >
        <Flex justifyContent={{ default: 'justifyContentFlexStart' }}>
          <FlexItem>
            <Link to="/virtualclusters/Dashboard">
              <Button variant="secondary">Back</Button>
            </Link>
          </FlexItem>
        </Flex>
      </div>
    </Page>
  );
}
