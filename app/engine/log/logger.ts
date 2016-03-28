import {Observable} from 'rxjs/Observable';

export class Logger {

  constructor() {
  }

  static getStack(stack) {
    let statck = [];

    var errorText = stack;
    let errorAt = errorText.split("at");
    for (let i = 1; i < errorAt.length - 1; i++) {
      let errorClass = errorAt[i].split("/");
      let errorLine = errorClass[errorClass.length - 1].split(")");
      let explodeLine = errorLine[0].split(":");
      let errorLineName = explodeLine[0].replace(".js", "") + ":" + explodeLine[1];
      statck[i - 1] = errorLineName;
    }
    return statck;
  }

  static log(...objects) {
    try {
      throw new Error('stack');
    } catch(e) {
      let stack = this.getStack(e.stack);
      objects[objects.length] = stack;
      console.log(stack[1], objects);
    }
  }

}
