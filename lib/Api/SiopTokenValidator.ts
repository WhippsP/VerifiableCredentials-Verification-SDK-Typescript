/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TokenType, IExpected, ITokenValidator } from '../index';
import { IValidationResponse } from '../InputValidation/IValidationResponse';
import ValidationOptions from '../Options/ValidationOptions';
import IValidatorOptions from '../Options/IValidatorOptions';
import ValidationQueue from '../InputValidation/ValidationQueue';
import ValidationQueueItem from '../InputValidation/ValidationQueueItem';
import { SiopValidation } from '../InputValidation/SiopValidation';

/**
 * Class to validate a token
 */
export default class SiopTokenValidator implements ITokenValidator {

  /**
   * Create new instance of <see @class SiopTokenValidator>
   * @param validatorOption The options used during validation
   * @param expected values to find in the token to validate
   */
  constructor (private validatorOption: IValidatorOptions, private expected: IExpected) {
  }

 /**
   * Validate the token
   * @param queue with tokens to validate
   * @param queueItem under validation
   */
  public async validate(queue: ValidationQueue, queueItem: ValidationQueueItem): Promise<IValidationResponse> { 
    const options = new ValidationOptions(this.validatorOption, TokenType.siop);
    const validator = new SiopValidation(options, this.expected);
    queueItem.setResult(await validator.validate(queueItem.token));
    if (queueItem.validationResponse.tokensToValidate) {
      for (let inx=0; inx < queueItem.validationResponse.tokensToValidate.length; inx++) {
        queue.addToken(queueItem.validationResponse.tokensToValidate[inx]);
      }
    }
    return queueItem.validationResponse as IValidationResponse;
  }
  
  
  /**
   * Gets the type of token to validate
   */
  public get isType(): TokenType {
    return TokenType.siop;
  }
}

