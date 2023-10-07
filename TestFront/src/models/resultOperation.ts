export interface ResultOperation<T=any> {
    stateOperation: boolean;
    Message: string;
    exception  :string;
    result: T;
  }