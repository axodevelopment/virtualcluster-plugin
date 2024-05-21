/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title } from '@patternfly/react-core';
import './example.css';


export default function ExamplePage() {
  const { t } = useTranslation('plugin__console-plugin-template');

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Dashboard')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Dashboard')}</Title>
        </PageSection>
      </Page>
    </>
  );
}
