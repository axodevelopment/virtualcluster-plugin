/* eslint-disable @typescript-eslint/no-explicit-any */
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

/*
export interface VirtualCluster extends K8sResourceCommon {
  spec: VirtualClusterSpec;
  status?: VirtualClusterStatus;
}


export interface VirtualClusterSpec {
  virtualMachines: string[];
}
*/

export interface VirtualCluster extends K8sResourceCommon {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: { [key: string]: string };
    [key: string]: any; // This allows other optional metadata fields
  };
  spec?: {
    virtualMachines?: string[];
  };
  status?: any; // Add specific fields as needed
}

export interface VirtualClusterSpec {
  virtualMachines: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VirtualClusterStatus {
  // Define your status fields here
}

export interface VirtualClusterList extends K8sResourceCommon {
  kind: string;
  apiVersion: string;
  metadata: {
    resourceVersion: string;
  };
  items: VirtualCluster[];
}
