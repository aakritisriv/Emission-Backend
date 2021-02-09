import { Service } from 'typedi';
import { EWEdgeSdkService } from './edge-sdk.service';
import { EdgeDataProcessor } from '@hds/edge-sdk/services/middleware/data-processor.service';
import { EdgeData } from '@hds/edge-sdk';
import { OilBurnerService } from './oil-burner.service';
import { IDataModel } from '@hds/edge-sdk/models/middleware/data.model';

@Service()
export class DataCustomService {

  constructor(private edgeSdk: EWEdgeSdkService, private oilBurnerInfoService: OilBurnerService) {
  }

  public handleCrossover(): void {
    /**  
     *  send data via websockets if condition is passed
     */
    this.edgeSdk._dataProcessor.useEdgeDataProcessor(this.crossoverProcessor);
  }

  private crossoverProcessor: EdgeDataProcessor = (edgeData: EdgeData) => {
    const crossoveredVariablesMap: Map<string, string> = new Map();

    for (const variable of edgeData.variables) {
      const value: number = edgeData.getVariableInRow(0, variable);

      let counterpartValue: number;
      const counterpartVariable = this.getVariableCounterpart(variable);
      if (counterpartVariable === undefined) {
        continue;
      }

      const counterpartVariablePos = edgeData.getVariablePosition(counterpartVariable);
      if (counterpartVariablePos !== undefined) {
        counterpartValue = edgeData.getVariableInRow(0, counterpartVariable);
      } else {
        /**
         
         * we would be able to query cached variables
         */
        const cachedVariable: IDataModel = this.edgeSdk._dataProcessor.getCachedVariable(counterpartVariable);
        counterpartValue = cachedVariable?.value;
      }

      if (counterpartValue === undefined) {
        continue;
      }

      if (value > counterpartValue) {
        crossoveredVariablesMap.set(variable, counterpartVariable);
      }
    }

    if (crossoveredVariablesMap.size === 0) {
      return;
    }

    /*
     * we would be able to query registered subscribers
     */
    const subscriptions = this.edgeSdk._subscriptionManager.getSubscriptions();

    for (const [variable, counterpartVariable] of crossoveredVariablesMap) {
      const filteredSubscriptions = subscriptions.filter(sub => {
        return sub.variables.includes(variable) && sub.variables.includes(counterpartVariable);
      });

      const message = `"${variable}" is more than "${counterpartVariable}"`;
      for (const filteredSubscription of filteredSubscriptions) {
        /**
         * Via websockets, show Oil burner for every variable,
         * that passed the condition "variableB > variableA"
         */
        this.oilBurnerInfoService.displayOilBurner(filteredSubscription.uniqueName, variable, message);
      }
    }
  }

  private getVariableCounterpart = (variableName: string): string | undefined => {
    const label = variableName.slice(0, -1);
    const type = variableName.slice(-1);
    if (type !== 'B') { return; }

    return `${label}A`;
  };
}
