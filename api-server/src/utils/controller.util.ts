interface ServiceResult {
  success: boolean;
  message?: string;
  data?: any;
  deviation?: number;
}

export const ERRORS = {
  MISSING_COIN: {
    status: 400,
    message: 'Coin parameter is required'
  }
};

export const validateCoinParam = (coin: string | string[] | undefined): void => {
  if (!coin || typeof coin !== 'string') {
    throw ERRORS.MISSING_COIN;
  }
};

export const handleServiceError = (result: ServiceResult): void => {
  if (!result.success) {
    throw {
      status: result.message?.includes('Unsupported coin') ? 400 : 500,
      message: result.message
    };
  }
};