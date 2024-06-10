/* eslint-disable @typescript-eslint/no-explicit-any */
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export interface VirtualMachineRef {
  name: string;
  namespace: string;
}

export interface NodeRef {
  name: string;
}

export interface VirtualClusterSpec {
  virtualMachines?: VirtualMachineRef[];
  nodes?: NodeRef[];
}

export interface VirtualClusterStatus {
  status?: string;
}

export interface VirtualCluster extends K8sResourceCommon {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: { [key: string]: string };
    [key: string]: any; // This allows other optional metadata fields
  };
  spec?: VirtualClusterSpec;
  status?: VirtualClusterStatus;
}

export interface VirtualClusterList extends K8sResourceCommon {
  kind: string;
  apiVersion: string;
  metadata: {
    resourceVersion: string;
  };
  items: VirtualCluster[];
}
