/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title } from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { VirtualCluster } from 'src/types';
import { Table, Thead, Tr, Th, Td, Tbody } from '@patternfly/react-table';

export default function ExamplePage() {
  const { t } = useTranslation('plugin__console-plugin-template');
  const fakeData: VirtualCluster[] = [
    {
      apiVersion: 'organization.prototypes.com/v1',
      kind: 'VirtualCluster',
      metadata: {
        name: 'virtualcluster-juanjo',
        namespace: 'operator-virtualcluster',
      },
      spec: {
        virtualMachines: ['example', 'flapvm-juanjo'],
      },
      status: {},
    },
    {
      apiVersion: 'organization.prototypes.com/v1',
      kind: 'VirtualCluster',
      metadata: {
        name: 'virtualcluster-another',
        namespace: 'operator-virtualcluster',
      },
      spec: {
        virtualMachines: ['fedora-01', 'fedora-02', 'fedora-03'],
      },
      status: {},
    },
  ];

  const [virtualClusters, setVirtualClusters] = useState<VirtualCluster[]>([]);
  const namespace = 'operator-virtualcluster';

  /*
  useEffect(() => {
    setVirtualClusters(fakeData);
  }, []);
  */

  useEffect(() => {

    setVirtualClusters(fakeData);

  }, [namespace]);

  const columns = ['Name', 'Namespace', 'VirtualMachines'];
  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Dashboard')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Dashboard')}</Title>
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
                {virtualClusters.map(vc => (
                  <Tr key={vc.metadata.name}>
                    <Td dataLabel={vc.metadata.name}>{vc.metadata.name}</Td>
                    <Td dataLabel={vc.metadata.namespace}>{vc.metadata.namespace}</Td>
                    <Td > <ul>
                                {vc.spec.virtualMachines.map(vm => (
                                  <li key={vm}>{vm}</li>
                                ))}
                              </ul></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
        </PageSection>
      </Page>
    </>
  );
}
