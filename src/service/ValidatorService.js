class ValidatorService {
    validatePwd(pwd) {
        if (pwd === null || pwd.length === 0) {
            return ["Password must not be empty"]
        }
        return pwd.match(this.validatePwd_pattern()) ? [] : ["Password must be minimum 8 characters, at least one letter and one number"];
    }

    validatePwd_pattern() {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    }

    validateEmail(email: string) {
        return email.match(this.validateEmail_pattern()) ? [] : ["Incorrect email"]
    }

    validateEmail_pattern() {
        return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    }


    validateFirstName(firstName: string) {
        return firstName === null || firstName.length === 0 ? ['First name must not be empty'] : []
    }
    validateCategory(category) {
        return category ? [] : ["Choose category"];
    }

    validateAccount(account) {
        return account ? [] : ["Choose account"];
    }

    validateAccountTo(from, to) {
        const result = this.validateAccount(to)
        if (from?.id === to?.id) {
            result.push("Accounts must be different")
        }
        return result;
    }

    validateAmount(amount, balance) {
        const a = parseInt(amount)
        const b = parseInt(balance)
        const result = []
        if (a <= 0) {
            result.push("Amount must not be less or equal 0")
        }
        if (a > b) {
            result.push("Too much for this account")
        }
        return result;
    }

    validateRate(rate) {
        const r = parseInt(rate)
        const result = []
        if (r <= 0) {
            result.push("Rate must not be less or equal 0")
        }
        return result;
    }

    validateCommission(commission, amount, balance) {
        const c = parseInt(commission)
        const a = parseInt(amount)
        const b = parseInt(balance)
        const result = []
        if (c < 0) {
            result.push("Commission must not be less than 0")
        }
        if (c > 0 && (a + c) > b) {
            result.push("Too much for this account")
        }
        return result;
    }

    validateMatch(new1, new2) {
        return new1 === new2;
    }

    validateSpecified(field: string, value: string) {
        return value === undefined || value === null || value.length < 1 ? [`${field} must be specified`] : []
    }

}

export default new ValidatorService()