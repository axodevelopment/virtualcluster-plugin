import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export interface VirtualCluster extends K8sResourceCommon {
  spec: VirtualClusterSpec;
  status?: VirtualClusterStatus;
}

export interface VirtualClusterSpec {
  virtualMachines: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VirtualClusterStatus {
  // Define your status fields here
}