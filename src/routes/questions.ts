import { autoinject } from 'aurelia-framework';
import {Parser, ExpressionCloner, AccessMember, CallMember} from 'aurelia-binding'; 

export class Welcome {
    public message = 'Hello Gopal!';
    public json = {questions : [{
        name: "color",
        type: "./text",
        inputType: "color",
        title: "Favorite color："
    }, {
        name: "email",
        type: "./text",
        inputType: "email",
        title: "E-Mail Id：",
        placeHolder: "jon.snow@nightwatch.org",
        isRequired: true,
        validators: [{
            type: "email"
        }]
    }, {
        show: "questions[0].answer === 'red'",
        type: "./multi",
        name: "car",
        title: "Which car do you drive？",
        isRequired: true,
        colCount: 4,
        choices: [
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW"
        ],
        answer : [],
        initial: []
    }, {
        show: "(questions[0].answer === 'red') && (questions[2].answer) && questions[2].answer.indexOf('Nissan') !== -1",
        type: "./single",
        name: "city",
        title: "What is your city？",
        isRequired: true,
        colCount: 4,
        choices: [
            "Tokyo",
            "Osaka",
            "Nagoya",
            "Chennai"
        ]
    }]};
}


@autoinject()
export class DynamicBindingBehavior {

    constructor(private parser: Parser) {}

    bind(binding, _, propertyExpression) {
        if (!propertyExpression) propertyExpression = true;

        // Parse the expression that was passed as a string argument to
        // the binding behavior.
        let expression = this.parser.parse(propertyExpression);

        // Rebase the expression
        expression = rebaseExpression(expression, binding.sourceExpression);

        // Squirrel away the binding's original expression so we can restore
        // the binding to it's initial state later.
        binding.originalSourceExpression = binding.sourceExpression;

        // Replace the binding's expression.
        binding.sourceExpression = expression;
    }
  }
  

  export class ExpressionRebaser extends ExpressionCloner {  
    constructor(public base) {
      super();
      this.base = base;
    }
  
    visitAccessThis(access) {
      if (access.ancestor !== 0) {
        throw new Error('$parent expressions cannot be rebased.');
      }
      return this.base;
    }
  
    visitAccessScope(access) {
      if (access.ancestor !== 0) {
        throw new Error('$parent expressions cannot be rebased.');
      }
      return new AccessMember(this.base, access.name);
    }
  
    visitCallScope(call) {
      if (call.ancestor !== 0) {
        throw new Error('$parent expressions cannot be rebased.');
      }
      return new CallMember(this.base, call.name, this.cloneExpressionArray(call.args));
    }
  }
  
  export function rebaseExpression(expression, baseExpression) {  
    let visitor = new ExpressionRebaser(baseExpression);
    return expression.accept(visitor);
  }