/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Page,
  PageSection,
  Title,
  Button,
  Flex,
  FlexItem,
  Alert,
} from '@patternfly/react-core';
import { Link, useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';
import yaml from 'js-yaml';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { TreeView, TreeViewDataItem } from '@patternfly/react-core';

export default function Create() {
  const { t } = useTranslation('plugin__console-plugin-template');
  const [yamlContent, setYamlContent] = React.useState<string>(`
apiVersion: organization.prototypes.com/v1
kind: VirtualCluster
metadata:
  name: example-virtual-cluster
  namespace: operator-virtualcluster
spec:
  virtualMachines:
  - example-vm
  `);

  const history = useHistory();

  const handleCreate = async () => {
    try {
      const resource = yaml.load(yamlContent);
      await k8sCreate({
        model: {
          apiVersion: 'organization.prototypes.com/v1',
          kind: 'VirtualCluster',
          namespaced: true,
          abbr: '',
          label: '',
          labelPlural: '',
          plural: '',
        },
        data: resource,
      });
      history.push('/virtualclusters/Dashboard');
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYamlContent(event.target.value);
  };

  const treeData: TreeViewDataItem[] = [
    {
      name: 'VirtualCluster',
      defaultExpanded: true,
      children: [
        {
          name: 'apiVersion: organization.prototypes.com/v1',
        },
        {
          name: 'kind: VirtualCluster',
        },
        {
          name: 'metadata',
          defaultExpanded: true,
          children: [{ name: 'name: string' }, { name: 'namespace: string' }],
        },
        {
          name: 'spec',
          defaultExpanded: true,
          children: [{ name: 'virtualMachines: string[]' }],
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title data-test="create-page-title">
          {t('Create Virtual Cluster')}
        </title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Create Virtual Cluster')}</Title>
          <Alert variant="info" title="Namespace Requirement">
            The namespace must be <strong>operator-virtualcluster</strong>.
          </Alert>
        </PageSection>
        <PageSection variant="light">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '45%', marginRight: '5%' }}>
              <div
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    padding: '0.5rem',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                    }}
                  >
                    <button
                      className="pf-c-button pf-m-control"
                      type="button"
                      aria-label="Copy to clipboard"
                      onClick={() => navigator.clipboard.writeText(yamlContent)}
                      style={{ border: 'none', background: 'none' }}
                    >
                      <i className="fas fa-copy" aria-hidden="true"></i>
                    </button>
                    <button
                      className="pf-c-button pf-m-control"
                      type="button"
                      aria-label="Download code"
                      onClick={() => {
                        const blob = new Blob([yamlContent], {
                          type: 'text/yaml',
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'virtual-cluster.yaml';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      style={{ border: 'none', background: 'none' }}
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    <button
                      className="pf-c-button pf-m-control"
                      type="button"
                      aria-label="Upload code"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.yaml, .yml';
                        input.onchange = (e: any) => {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (e: any) => {
                            setYamlContent(e.target.result);
                          };
                          reader.readAsText(file);
                        };
                        input.click();
                      }}
                      style={{ border: 'none', background: 'none' }}
                    >
                      <i className="fas fa-upload"></i>
                    </button>
                  </div>
                  <div></div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        marginRight: '0.5rem',
                      }}
                    >
                      <i className="fas fa-code"></i>
                    </span>
                    <span>YAML</span>
                  </div>
                </div>
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <code
                    style={{
                      display: 'block',
                    }}
                  >
                    <pre
                      style={{
                        margin: 0,
                      }}
                    >
                      <textarea
                        value={yamlContent}
                        onChange={handleChange}
                        rows={20}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          fontFamily: 'monospace',
                          resize: 'none',
                          background: 'transparent',
                          color: '#333',
                          padding: '10px',
                        }}
                      />
                    </pre>
                  </code>
                </div>
              </div>
            </div>
            <div style={{ width: '45%' }}>
              <Title headingLevel="h2">Schema Description</Title>
              <TreeView data={treeData} />
            </div>
          </div>
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
              <Button variant="primary" onClick={handleCreate}>
                Create
              </Button>
            </FlexItem>
            <FlexItem>
              <Link to="/virtualclusters/Dashboard">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </FlexItem>
          </Flex>
        </div>
      </Page>
    </>
  );
}
