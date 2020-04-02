import { autoinject } from 'aurelia-framework';
import { Parser, ExpressionCloner, AccessMember, CallMember } from 'aurelia-binding'; 

@autoinject()
export class DynamicBindingBehavior {
    bindings: any[] = [];
    constructor(private parser: Parser) {}

    bind(binding, _, propertyExpression) {
        if (!propertyExpression) propertyExpression = 'true';
    
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
        if (propertyExpression !== 'true') {
          this.bindings.push(binding);
        }
      }
}

class ExpressionRebaser extends ExpressionCloner {  
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
  
    // visitCallScope(call) {
    //   if (call.ancestor !== 0) {
    //     throw new Error('$parent expressions cannot be rebased.');
    //   }
    //   return new CallMember(this.base, call.name, this.cloneExpressionArray(call.args));
    // }
  }
  
  function rebaseExpression(expression, baseExpression) {  
    let visitor = new ExpressionRebaser(baseExpression);
    return expression.accept(visitor);
  }