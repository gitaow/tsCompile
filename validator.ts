type ValidationResult<T, U> = Partial<{ [Key in keyof T]: U }>;
type Validation<T, U> = (fields: T) => ValidationResult<T, U>;

const obj:any = {
    name: 'validator'
};

class Invalid implements invalid {
    public errorMessage: string;

    public constructor(message: string) {
        this.errorMessage = message;
    }
}
obj.Invalid = Invalid;

obj.error = function(obj: any) {
    return {
        error: 'validation',
        reason: 'invalid',
        message: obj
    };
};

obj.hasError = function(o: any, isRecursive: boolean = false) :boolean {
    for (const i in o) {
        if(isRecursive === false) {
            if(Array.isArray(o[i])) {
                //step through children
                for (const x in o[i]) {
                    if (obj.hasError(o[i][x], true)) {
                        return true;
                    }
                }
            } else if(typeof o[i] == 'object') {
                //step through children
                for (const x in o[i]) {
                    if (obj.hasError(o[i], true)) {
                        return true;
                    }
                }
            }
        } else if (i == 'errorMessage' || o[i] && o[i].errorMessage) {
            return true;
        }
    }
    return false;
};

// const hasError = function (obj: any) :boolean {
//     return checkError(obj, false);
// };

const vMinLength = <T>(len: number, input: any) => input.length >= len ? true : new Invalid('errValid.minLen ' + len);
const vMaxLength = <T>(len: number, input: any) => input.length <= len ? true : new Invalid('errValid.maxLen ' + len);
const vMin = <T>(v: number, input: number) => input >= v ? true : new Invalid('errValid.min ' + v);
const vMax = <T>(v: number, input: number) => input <= v ? true : new Invalid('errValid.max ' + v);
const vDate = <T>(input: string) => new Date(input) ? true : new Invalid('errValid.date');
const vFutureDate = <T>(input: string) => new Date(input) >= new Date(new Date().toDateString()) ? true : new Invalid('errValid.dateFuture');
const regUrl = /^((https?|http?):\/\/)?[^\s$.?#].[^\s]*$/;
const vUrl = <T>(input: string) => regUrl.test(input) ? true : new Invalid('errValid.url');
const regPhone = /^[+0-9\s]{7,}$/;
const vPhone = <T>(input: string) => regPhone.test(input) ? true : new Invalid('errValid.phone');
const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const vEmail = <T>(input: string) => regEmail.test(input.trim()) ? true : new Invalid('errValid.email');

const isEmail = (input: any) => {
    if(input && input.errorMessage) {
        return input;
    }

    if (input === null) {
        return new Invalid('emailValidator expected a string but received null.');

    } else if (input === undefined) {
        return new Invalid('emailValidator expected a string but received undefined.');

    } else if (typeof input !== 'string') {
        return new Invalid(`emailValidator expected a string but received ${typeof input}.`);
    }

    const res = vEmail(input);
    if (typeof res == 'object') return res;

    return input;
};

const isPhone = (input: any) => {
    if(input && input.errorMessage) {
        return input;
    }

    if (input === null) {
        return new Invalid('phoneValidator expected a string but received null.');

    } else if (input === undefined) {
        return new Invalid('phoneValidator expected a string but received undefined.');

    } else if (typeof input !== 'string') {
        return new Invalid(`phoneValidator expected a string but received ${typeof input}.`);
    }

    const res = vPhone(input);
    if (typeof res == 'object') return res;

    return input;
};

const isUrl = (input: any) => {
    if(input && input.errorMessage) {
        return input;
    }

    if (input === null) {
        return new Invalid('urlValidator expected a string but received null.');

    } else if (input === undefined) {
        return new Invalid('urlValidator expected a string but received undefined.');

    } else if (typeof input !== 'string') {
        return new Invalid(`urlValidator expected a string but received ${typeof input}.`);
    }

    const res = vUrl(input);
    if (typeof res == 'object') return res;

    return input;
};

const isArray = (input: any) => {
    if(input && input.errorMessage) {
        return input;
    }

    if (input === null) {
        return new Invalid('arrayValidator expected a array but received null.');

    } else if (input === undefined) {
        return new Invalid('arrayValidator expected a array but received undefined.');

    } else if (typeof input !== 'object' && !Array.isArray(input)) {
        return new Invalid(`arrayValidator expected a array but received ${typeof input}.`);
    }

    // if(expected) {
    //     input.forEach(obj => {
    //         if(eval(expected.replace('#v', obj)) !== true) return new Invalid('arrayValidator expected a array with certain types.');
    //     });
    // }

    return input;
};

const isObject = (input: any) => {
    if(input && input.errorMessage) {
        return input;
    }

    if (input === null) {
        return new Invalid('objectValidator expected a object but received null.');

    } else if (input === undefined) {
        return new Invalid('objectValidator expected a object but received undefined.');

    } else if (typeof input !== 'object') {
        return new Invalid(`objectValidator expected a object but received ${typeof input}.`);
    }

    // if(expected) {
    //     input.forEach(obj => {
    //         if(eval(expected.replace('#v', obj)) !== true) return new Invalid('arrayValidator expected a array with certain types.');
    //     });
    // }

    return input;
};

const isBool = (input: any) => {
    if(input && input.errorMessage) {
        return input;
    }

    if (input === null) {
        return new Invalid('booleanValidator expected a boolean but received null.');

    } else if (input === undefined) {
        return new Invalid('booleanValidator expected a boolean but received undefined.');

    } else if (typeof input !== 'boolean') {
        return new Invalid(`booleanValidator expected a boolean but received ${typeof input}.`);
    }

    return input;
};

const isDate = (input: any, inFuture: boolean = true) => {
    if(input && input.errorMessage) {
        return input;
    }

    if (input === null) {
        return new Invalid('errValid.date');

    } else if (input === undefined) {
        return new Invalid('errValid.date');

    } else if (typeof input !== 'string') {
        return new Invalid(`dateValidator expected a string but received ${typeof input}.`);
    }

    let res;

    // if(inFuture) {
    //     res = vFutureDate(input);
    //
    // } else {
    res = vDate(input);
    // }

    if (res !== true) return res;

    return input;
};

const isNumber = (input: any, min: number = null, max: number = null) => {
    if(input && input.errorMessage) {
        return input;
    }

    //check input
    if (input === null) {
        return new Invalid('NumberValidator expected a number but received null.');

    } else if (input === undefined) {
        return new Invalid('NumberValidator expected a number but received undefined.');

    } else if (typeof input !== 'number') {
        return new Invalid(`NumberValidator expected a number but received ${typeof input}.`);
    }

    if (min) {
        const res = vMin(min, input);
        if (res !== true) return res;
    }

    if (max) {
        const res = vMax(max, input);
        if (res !== true) return res;
    }

    return input;
};

const isString = (input: any, min: number, max: number) => {
    if(input && input.errorMessage) {
        return input;
    }

    //check input
    if (input === null) {
        return new Invalid('StringValidator expected a string but received null.');

    } else if (input === undefined) {
        return new Invalid('StringValidator expected a string but received undefined.');

    } else if (typeof input !== 'string') {
        return new Invalid(`StringValidator expected a string but received ${typeof input}.`);
    }

    if (min) {
        const res = vMinLength(min, input);
        if (res !== true) return res;
    }

    if (max) {
        const res = vMaxLength(max, input);
        if (res !== true) return res;
    }

    return input;
};

const isAlphaNum = (input: any, min: number, max: number) => {
    if(input && input.errorMessage) {
        return input;
    }

    const v = input.toString();

    //check input
    if (!v.match(/[a-z0-9\-]+/)) {
        return new Invalid('AlphaNumValidator expected a string or number but received: ' + input);
    }

    if (min) {
        const res = vMinLength(min, v);
        if (res !== true) return res;
    }

    if (max) {
        const res = vMaxLength(max, v);
        if (res !== true) return res;
    }

    return input;
};

// const isId = (input: string) => {
//     // rule: uId:<id>(12)
//     //uId == login or writer...
//     return input;
// };

obj.rulesProposal = [
    ({ d_created }: proposal) => ({
        d_created: isDate(d_created)
    }),
    ({ d_proposal }: proposal) => ({
        d_proposal: isDate(d_proposal)
    }),
    ({ d_proposalTo }: proposal) => ({
        d_proposalTo: isDate(d_proposalTo)
    }),
    ({ origin }: proposal) => ({
        origin: isString(origin, 1, 10)
    }),
    ({ status }: proposal) => ({
        status: isString(status, 1, 10)
    }),
    ({ txt }: proposal) => {
        if(txt) {
            return {txt: isString(txt, 0, 30)};
        } else {
            return;
        }
    },
    ({ d_replicated }: proposal) => {
        if(d_replicated) {
            return {d_replicated: isDate(d_replicated)};
        } else {
            return;
        }
    }
];

const hasProposals = (input: proposal[]) => {
    if(input && input.length === 0) {
        return new Invalid('errValidator.noProposal');
    }

    if(input && Array.isArray(input)) {
        input.forEach(o => {
            const rs = obj.validate(obj.rulesProposal, o);

            if (obj.hasError(rs)) {
                return new Invalid('errValidator.invalidProposal');
            }
        });
    }

    if (typeof input !== 'object') {
        return new Invalid(`proposalValidator expected a array with proposals but received ${typeof input}.`);
    }

    return input;
};

obj.rulesMessage = [
    ({ origin }: message) => ({
        origin: isString(origin, 1, 10)
    }),
    ({ txt }: message) => {
        if(txt) {
            return {txt: isString(txt, 1, 50000)};
        } else {
            return;
        }
    },
    ({ d_created }: message) => {
        if(d_created) {
            return {d_created: isDate(d_created)};
        } else {
            return;
        }
    },
    ({ d_replicated }: message) => {
        if(d_replicated) {
            return {d_replicated: isDate(d_replicated)};
        } else {
            return;
        }
    },
    ({ d_seen }: message) => {
        if(d_seen) {
            return {d_seen: isDate(d_seen)};
        } else {
            return;
        }
    },
    ({ pics }: message) => {
        if(pics) {
            return {pics: isArray(pics)};
        } else {
            return;
        }
    }
];
const hasMessages = (input: any[]) => {
    if(input && input.length === 0) {
        return new Invalid('messageValidator no messages.');
    }

    input.forEach((o) => {
        const rs = obj.validate(obj.rulesMessage, o);

        if (obj.hasError(rs)) {
            o = rs;
        }
    });

    if (typeof input !== 'object') {
        return new Invalid(`messageValidator expected a array with messages but received ${typeof input}.`);
    }

    return input;
};

//for all validations                       assign to self executed validation for fields
obj.validate = <T, U = any>(
    validations: Validation<T, U>[],
    fields: T
): ValidationResult<T, U> => validations.reduce( (acc, validation) => Object.assign(acc, validation(fields)), {} );

//     if(hasError(validations)) {
//         throw({'invalid': validations});
//     }
// };

obj.decorateDoc = <T, U>(n: any, o: any, usr: string) => {
    // if(o._id) n._id = o._id;
    // if(o._rev) n._rev = o._rev;
    // if(o.type) n.type = o.type;
    if(!n.d_created) {
        n.d_created = new Date().toISOString();
    }

    n.d_updated = new Date().toISOString();
    n.updated_by = usr ? usr : o.updated_by;
};
// type title = string;
// type midStr = string;
// type text = string;
//
// interface comment {
//     name: title;
//     description: midStr;
// }
//
// class Com implements comment {
//     name: title;
//     description: midStr;
// }

obj.rulesOrder = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ clientId }: orderInt) => ({
        clientId: isNumber(clientId)
    }),
    ({ d_created }: orderInt) => ({
        d_created: isDate(d_created, false)
    }),
    ({ items }: orderInt) => ({
        items: isArray(items)
    }),
    ({ total }: orderInt) => ({
        total: isNumber(total, 0.05, 999999)
    }),
    ({ delivery }: orderInt) => ({
        delivery: isString(delivery, 1, 10)
    }),
    ({ status }: orderInt) => ({
        status: isString(status, 1, 10)
    }),
    ({ d_payed }: orderInt) => {
        if(d_payed) {
            return { d_payed: isDate(d_payed) };
        } else {
            return true;
        }
        
    }
];

obj.rulesAppointment = [
    ({ _id }: appointment) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: appointment) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: appointment) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: appointment) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: appointment) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ clientId }: appointment) => ({
        clientId: isNumber(clientId)
    }),
    ({ d_created }: appointment) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: appointment) => ({
        title: isString(title, 3, 255)
    }),
    ({ titleCode }: appointment) => {
        if(titleCode) {
            return {titleCode: isString(titleCode, 1, 50)};
        } else {
            return true;
        }
    },
    ({ duration }: appointment) => {
        if(duration) {
            return {duration: isNumber(duration, 1, 600)};
        } else {
            return true;
        }
    },
    ({ proposals }: appointment) => {
        if(proposals) {
            return {proposals: hasProposals(proposals)};
        } else {
            return true;
        }
    },
    ({ d_appointment }: appointment) => {
        if(d_appointment) {
            return {d_appointment: isDate(d_appointment)};
        } else {
            return true;
        }
    },
    ({ d_replicated }: appointment) => {
        if(d_replicated) {
            return {d_replicated: isDate(d_replicated)};
        } else {
            return true;
        }
    },
    ({ d_accept }: appointment) => {
        if(d_accept) {
            return {d_accept: isDate(d_accept)};
        } else {
            return true;
        }
    },
    ({ d_confirm_alarm1 }: appointment) => {
        if(d_confirm_alarm1) {
            return {d_confirm_alarm1: isDate(d_confirm_alarm1)};
        } else {
            return true;
        }
    },
    ({ d_confirm_alarm2 }: appointment) => {
        if(d_confirm_alarm2) {
            return {d_confirm_alarm2: isDate(d_confirm_alarm2)};
        } else {
            return true;
        }
    },
    ({ d_confirm_alarm3 }: appointment) => {
        if(d_confirm_alarm3) {
            return {d_confirm_alarm3: isDate(d_confirm_alarm3)};
        } else {
            return true;
        }
    },
    // ({ noShow }: appointment) => {
    //     if(noShow) {
    //         return {noShow: isString(noShow, 1, 100)};
    //     } else {
    //         return true;
    //     }
    // },
    ({ d_userCancel }: appointment) => {
        if(d_userCancel) {
            return {d_userCancel: isString(d_userCancel, 1, 100)};
        } else {
            return true;
        }
    },
    ({ cancelled }: appointment) => {
        if(cancelled) {
            return {cancelled: isString(cancelled, 1, 100)};
        } else {
            return true;
        }
    },
    // ({ hasOnlyRejects }: appointment) => {
    //     if(hasOnlyRejects) {
    //         return {hasOnlyRejects: isBool(hasOnlyRejects)};
    //     } else {
    //         return true;
    //     }
    // }
    ({ archive }: appointment) => {
        if(archive) {
            return {archive: isBool(archive)};
        } else {
            return {archive: false};
        }
    },
    ({ reasonArchive }: appointment) => {
        if(reasonArchive) {
            return {reasonArchive: isString(reasonArchive, 5, 200)};
        } else {
            return true;
        }
    },
    ({ importId }: appointment) => {
        if(importId) {
            return {importId: isAlphaNum(importId, 1, 50)};
        } else {
            return true;
        }
    },
    ({ d_imported }: appointment) => {
        if(d_imported) {
            return {d_imported: isDate(d_imported)};
        } else {
            return true;
        }
    },
    ({ showImportId }: appointment) => {
        if(showImportId) {
            return {showImportId: isAlphaNum(showImportId, 1, 50)};
        } else {
            return true;
        }
    }
];

obj.rulesPayment = [
    ({ _id }: payment) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: payment) => ({
        type: isString(type, 1, 15)
    }),
    ({ clientId }: payment) => ({
        clientId: isNumber(clientId)
    }),
    ({ updated_by }: payment) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: payment) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: payment) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: payment) => ({
        d_created: isDate(d_created, false)
    }),
    ({ importId }: payment) => ({
        importId: isAlphaNum(importId, 1, 25)
    }),
    ({ payNr }: payment) => ({
        payNr: isAlphaNum(payNr, 1, 25)
    }),
    ({ amount }: payment) => ({
        amount: isNumber(amount)
    }),
    ({ total }: payment) => ({
        total: isNumber(total)
    }),
    ({ requestId }: payment) => {
        if (requestId) {
            return {requestId: isString(requestId, 12, 64)};
        } else {
            return true;
        }
    },
    ({ transactionId }: payment) => {
        if (transactionId) {
            return {transactionId: isString(transactionId, 12, 64)};
        } else {
            return true;
        }
    },
    ({ status }: payment) => ({
        status: isNumber(status)
    }),
    ({ d_reminder1 }: payment) => {
        if (d_reminder1) {
            return {d_reminder1: isDate(d_reminder1)};
        } else {
            return true;
        }
    },
    ({ d_reminder2 }: payment) => {
        if (d_reminder2) {
            return {d_reminder2: isDate(d_reminder2)};
        } else {
            return true;
        }
    },
    ({ d_replicated }: payment) => {
        if (d_replicated) {
            return {d_replicated: isDate(d_replicated)};
        } else {
            return true;
        }
    }
];

obj.rulesTreatment = [
    ({ _id }: treatment) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: treatment) => ({
        type: isString(type, 1, 15)
    }),
    ({ clientId }: treatment) => ({
        clientId: isNumber(clientId)
    }),
    ({ updated_by }: treatment) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: treatment) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: treatment) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: treatment) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: treatment) => ({
        title: isString(title, 5, 100)
    }),
    ({ txt }: treatment) => ({
        txt: isString(txt, 5, 10000000)
    }),
    ({ d_deleted }: treatment) => {
        if(d_deleted) {
            return {d_deleted: isDate(d_deleted)};
        } else {
            return true;
        }
    },
    ({ reminders }: treatment) => {
        if(reminders) {
            return {reminders: isArray(reminders)};
        } else {
            return true;
        }
    },
    ({ status }: treatment) => {
        if (status) {
            return {status: isString(status, 1, 50)};
        } else {
            return true;
        }
    },
    ({ d_replicated }: treatment) => {
        if (d_replicated) {
            return {d_replicated: isDate(d_replicated)};
        } else {
            return true;
        }
    }
];

obj.rulesTipsTricks = [
    ({ _id }: tipsTricks) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: tipsTricks) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: tipsTricks) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: tipsTricks) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: tipsTricks) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: tipsTricks) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: tipsTricks) => ({
        title: isString(title, 0, 650)
    }),
    ({ txt }: tipsTricks) => ({
        txt: isString(txt, 0, 10000000)
    }),
    ({ category }: tipsTricks) => {
        if (category) {
            return {category: isString(category, 1, 50)};
        } else {
            return true;
        }
    },
    ({ recipeOptions }: tipsTricks) => {
        if (recipeOptions) {
            return {recipeOptions: isArray(recipeOptions)};
        } else {
            return true;
        }
    },
    ({ archive }: tipsTricks) => {
        if (archive) {
            return {archive: isBool(archive)};
        } else {
            return true;
        }
    }
];

obj.rulesWorkflow = [
    ({ _id }: tipsTricks) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: tipsTricks) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: tipsTricks) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: tipsTricks) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: tipsTricks) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: tipsTricks) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: tipsTricks) => ({
        title: isString(title, 0, 650)
    }),
    ({ txt }: tipsTricks) => ({
        txt: isString(txt, 0, 10000000)
    }),
    ({ category }: tipsTricks) => {
        if (category) {
            return {category: isString(category, 1, 50)};
        } else {
            return true;
        }
    },
    ({ archive }: tipsTricks) => {
        if (archive) {
            return {archive: isBool(archive)};
        } else {
            return true;
        }
    }
];

obj.rulesAbsence = [
    ({ _id }: absence) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: absence) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: absence) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: absence) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: absence) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ clientId }: absence) => ({
        clientId: isNumber(clientId)
    }),
    ({ d_created }: absence) => ({
        d_created: isDate(d_created, false)
    }),
    ({ d_start }: absence) => ({
        d_start: isDate(d_start, true)
    }),
    ({ d_end }: absence) => ({
        d_end: isDate(d_end, true)
    }),
    ({ typ }: absence) => ({
        typ: isNumber(typ, 0, 99)
    }),
    ({ reason }: absence) => {
        if(reason != undefined) {
            return {reason: isString(reason, 3, 150)};
        } else {
            return true;
        }
    },
    ({ approved }: absence) => {
        if(approved != undefined) {
            return {approved: isBool(approved)};
        } else {
            return true;
        }
    },
    ({ d_deleted }: absence) => {
        if(d_deleted != undefined) {
            return {d_deleted: isDate(d_deleted)};
        } else {
            return true;
        }
    },
    ({ _attachments }: absence) => {
        if(_attachments) {
            return {_attachments: isObject(_attachments)};
        } else {
            return true;
        }
    }
];

obj.rulesBankHoliday = [
    ({ _id }: bankHoliday) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: bankHoliday) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: bankHoliday) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: bankHoliday) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: bankHoliday) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: bankHoliday) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: bankHoliday) => ({
        title: isString(title, 3, 50)
    }),
    ({ d_start }: bankHoliday) => ({
        d_start: isDate(d_start, true)
    }),
    ({ typ }: bankHoliday) => ({
        typ: isNumber(typ, 0, 99)
    }),
    ({ formula }: bankHoliday) => {
        if(formula) {
            return {formula: isString(formula, 1, 100)};
        } else {
            return true;
        }
    }
];

obj.rulesTimestamp = [
    ({ _id }: timestamp) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: timestamp) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: timestamp) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: timestamp) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: timestamp) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ clientId }: timestamp) => ({
        clientId: isNumber(clientId)
    }),
    ({ d_created }: timestamp) => ({
        d_created: isDate(d_created, false)
    }),
    ({ stamps }: timestamp) => ({
        stamps: isArray(stamps)
    }),
    ({ total }: timestamp) => ({
        total: isArray(total)
    }),
    ({ overtime }: timestamp) => ({
        overtime: isNumber(overtime, 0, 150000000000)
    }),
    // ({ unpaid }: timestamp) => ({
    //     unpaid: isNumber(unpaid, 0, 150000000000)
    // }),
    ({ soll }: timestamp) => ({
        soll: isNumber(soll, 0, 150000000000)
    }),
    ({ previous }: timestamp) => {
        if(previous) {
            return {previous: isNumber(previous, 1, 86400000000)};
        } else {
            return true;
        }
    },
    ({ booked }: timestamp) => {
        if(booked) {
            return {booked: isString(booked, 20, 85)};
        } else {
            return true;
        }
    },
    ({ usrApproved }: timestamp) => {
        if(usrApproved) {
            return {usrApproved: isDate(usrApproved)};
        } else {
            return true;
        }
    },
    ({ description }: timestamp) => {
        if(description) {
            return {description: isString(description, 1, 600)};
        } else {
            return true;
        }
    }
];

obj.rulesShift = [
    ({ _id }: shift) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: shift) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: shift) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: shift) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: shift) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ clientId }: shift) => ({
        clientId: isNumber(clientId)
    }),
    ({ d_created }: shift) => ({
        d_created: isDate(d_created, false)
    }),
    ({ d_start }: shift) => ({
        d_start: isDate(d_start)
    }),
    ({ d_end }: shift) => ({
        d_end: isDate(d_end)
    }),
    ({ typ }: shift) => ({
        typ: isNumber(typ, 1, 999)
    }),
    ({ cost }: shift) => {
        if(cost) {
            return {cost: isNumber(cost, 1, 9999)};
        } else {
            return true;
        }
    },
    ({ title }: shift) => ({
        title: isString(title, 1, 32)
    }),
    ({ uId }: shift) => ({
        uId: isString(uId, 3, 40)
    }),
    ({ deleted }: shift) => {
        if(deleted) {
            return {deleted: isBool(deleted)};
        } else {
            return true;
        }
    }
];

obj.rulesArticle = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: article) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: article) => ({
        title: isString(title, 5, 100)
    }),
    ({ txt }: article) => ({
        txt: isString(txt, 10, 10000000)
    }),
    ({ bookingPlace }: article) => ({
        bookingPlace: isString(bookingPlace, 1, 7)
    }),
    ({ titlePic }: article) => {
        if(titlePic) {
            return {titlePic: titlePic};
        } else {
            return true;
        }
    },
    ({ treatment }: article) => {
        if(treatment) {
            return {treatment: isString(treatment, 10, 10000000)};
        } else {
            return true;
        }
    },
    ({ productLinks }: article) => {
        if(productLinks) {
            return {productLinks: isArray(productLinks)};
        } else {
            return true;
        }
    },
    ({ avgRating }: article) => {
        if(avgRating || avgRating === 0) {
            return {avgRating: isNumber(avgRating, 0, 5)};
        } else {
            return true;
        }
    },
    ({ cnt }: article) => {
        if(cnt || cnt === 0) {
            return {cnt: isNumber(cnt, 0, 99999)};
        } else {
            return true;
        }
    },
    ({ translations }: article) => {
        if(translations) {
            return {translations: isArray(translations)};
        } else {
            return true;
        }
    },
    ({ archive }: article) => {
        if(archive) {
            return {archive: isBool(archive)};
        } else {
            return {archive: false};
        }
    },
    ({ templateRef }: article) => {
        if(templateRef) {
            return {templateRef: isObject(templateRef)};
        } else {
            return true;
        }
    },
    ({ quickSelect }: article) => {
        if(quickSelect) {
            return {quickSelect: isBool(quickSelect)};
        } else {
            return true;
        }
    },
    ({ startSelect }: article) => {
        if(startSelect) {
            return {startSelect: isBool(startSelect)};
        } else {
            return true;
        }
    },
    ({ titleCode }: article) => {
        if(titleCode) {
            return {titleCode: isString(titleCode, 1, 50)};
        } else {
            return true;
        }
    },
    ({ warningMsg }: article) => {
        if(warningMsg) {
            return {warningMsg: isString(warningMsg, 1, 250)};
        } else {
            return true;
        }
    },
    ({ warningMerge }: article) => {
        if(warningMerge) {
            return {warningMerge: isBool(warningMerge)};
        } else {
            return true;
        }
    },
    ({ duration }: article) => {
        if(duration) {
            return {duration: isNumber(duration, 1, 999)};
        } else {
            return true;
        }
    },
    ({ afterDuration }: article) => {
        if(afterDuration) {
            return {afterDuration: isNumber(afterDuration, 1, 999)};
        } else {
            return true;
        }
    },
    ({ mergeDuration }: article) => {
        if(mergeDuration) {
            return {mergeDuration: isNumber(mergeDuration, 1, 999)};
        } else {
            return true;
        }
    },
    ({ pos }: article) => {
        if(pos || pos === 0) {
            return {pos: isNumber(pos, 0, 999)};
        } else {
            return true;
        }
    }
];

obj.rulesTemplate = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: template) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: template) => ({
        title: isString(title, 5, 100)
    }),
    ({ txt }: template) => ({
        txt: isString(txt, 5, 10000000)
    }),
    ({ titlePic }: template) => {
        if(titlePic) {
            return {titlePic: titlePic};
        } else {
            return true;
        }
    },
    ({ description }: template) => ({
        description: isString(description, 1, 300)
    }),
    ({ translations }: template) => {
        if(translations) {
            return {translations: isArray(translations)};
        } else {
            return true;
        }
    },
    ({ buy }: template) => {
        if(buy) {
            return {buy: isNumber(buy, 1, 99999)};
        } else {
            return true;
        }
    }
];

obj.rulesProduct = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: product) => ({
        d_created: isDate(d_created, false)
    }),
    ({ title }: product) => ({
        title: isString(title, 5, 100)
    }),
    ({ txt }: product) => ({
        txt: isString(txt, 0, 1500)
    }),
    ({ unit }: product) => ({
        unit: isString(unit, 1, 10)
    }),
    ({ price }: product) => ({
        price: isNumber(price, 0.05, 99999)
    }),
    ({ quantity }: product) => ({
        quantity: isNumber(quantity, 1, 1000)
    }),
    // ({ target }: product) => ({
    //     target: isString(target, 1, 10)
    // }),
    ({ translations }: product) => {
        if(translations) {
            return {translations: isArray(translations)};
        } else {
            return true;
        }
    },
    ({ web }: product) => {
        if (web) {
            return {web: isUrl(web)};
        } else {
            return true;
        }
    },
    ({ titlePic }: product) => {
        if(titlePic) {
            return {titlePic: isString(titlePic, 50, 200000)};
        } else {
            return true;
        }
    },
    ({ pos }: product) => {
        if(pos || pos === 0) {
            return {pos: isNumber(pos, 0, 999)};
        } else {
            return true;
        }
    },
    ({ archive }: product) => {
        if(archive) {
            return {archive: isBool(archive)};
        } else {
            return true;
        }
    }
];

obj.rulesPartner = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: partner) => ({
        d_created: isDate(d_created, false)
    }),
    ({ name }: partner) => ({
        name: isString(name, 5, 100)
    }),
    ({ zip }: partner) => ({
        zip: isString(zip, 1, 15)
    }),
    ({ street }: partner) => ({
        street: isString(street, 1, 100)
    }),
    ({ city }: partner) => ({
        city: isString(city, 1, 100)
    }),
    ({ country }: partner) => ({
        country: isString(country, 1, 100)
    }),
    ({ email }: partner) => {
        if(email) {
            return {email: isEmail(email)};
        } else {
            return true;
        }
    },
    ({ phone }: partner) => ({
        phone: isPhone(phone)
    }),
    ({ web }: partner) => {
        if(web) {
            return {web: isUrl(web)};
        } else {
            return true;
        }
    },
    ({ offering }: partner) => {
        if(offering) {
            return {offering: isString(offering, 1, 100)};
        } else {
            return true;
        }
    },
    ({ openTimes }: partner) => {
        if(openTimes) {
            return {openTimes: openTimes};
        } else {
            return true;
        }
    },
    ({ pic }: partner) => {
        if(pic) {
            return {pic: isString(pic, 1, 100000)};
        } else {
            return true;
        }
    },
    ({ pos }: partner) => {
        if(pos || pos === 0) {
            return {pos: isNumber(pos, 0, 999)};
        } else {
            return true;
        }
    }
];

obj.rulesPromotion = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: promotion) => ({
        d_created: isDate(d_created, false)
    }),
    ({ refId }: promotion) => ({
        refId: isString(refId, 1, 64)
    }),
    ({ target }: promotion) => ({
        target: isString(target, 1, 10)
    }),
    ({ author }: promotion) => ({
        author: isString(author, 1, 100)
    }),
    ({ titleOverride }: promotion) => {
        if(titleOverride) {
            return {titleOverride: isString(titleOverride, 1, 50)};
        } else {
            return true;
        }
    },
    ({ d_start }: promotion) => {
        if(d_start) {
            return {d_start: isDate(d_start)};
        } else {
            return true;
        }
    },
    ({ d_end }: promotion) => {
        if(d_end) {
            return {d_end: isDate(d_end)};
        } else {
            return true;
        }
    },
    ({ d_sent }: promotion) => {
        if(d_sent) {
            return {d_sent: isDate(d_sent)};
        } else {
            return true;
        }
    },
    ({ status }: promotion) => {
        if(status) {
            return {status: isString(status, 1, 10)};
        } else {
            return true;
        }
    },
    ({ recipients }: promotion) => {
        if(recipients) {
            return {recipients: isArray(recipients)};
        } else {
            return true;
        }
    },
    ({ visum }: promotion) => {
        if(visum) {
            return {visum: isString(visum, 1, 100)};
        } else {
            return true;
        }
    },
    ({ archive }: promotion) => {
        if(archive) {
            return {archive: isBool(archive)};
        } else {
            return true;
        }
    }
];

obj.rulesChat = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ clientId }: chat) => ({
        clientId: isNumber(clientId)
    }),
    ({ d_created }: chat) => ({
        d_created: isDate(d_created, false)
    }),
    ({ status }: chat) => ({
        status: isString(status, 1, 10)
    }),
    ({ needAnswer }: chat) => {
        if(needAnswer) {
            return {needAnswer: isString(needAnswer, 1, 25)};
        } else {
            return true;
        }
    },
    ({ d_needAnswer }: chat) => {
        if(d_needAnswer) {
            return {d_needAnswer: isDate(d_needAnswer)};
        } else {
            return true;
        }
    },
    ({ d_replicated }: chat) => {
        if(d_replicated) {
            return {d_replicated: isDate(d_replicated)};
        } else {
            return true;
        }
    },
    ({ d_lastOpened }: chat) => {
        if(d_lastOpened) {
            return {d_lastOpened: isDate(d_lastOpened)};
        } else {
            return true;
        }
    },
    ({ replyYesNo }: chat) => {
        if(typeof replyYesNo == 'boolean') {
            return {replyYesNo: isBool(replyYesNo)};
        } else {
            return true;
        }
    },
    ({ _attachments }: chat) => {
        if(_attachments) {
            return {_attachments: isObject(_attachments)};
        } else {
            return true;
        }
    },
    ({ params }: chat) => {
        if(params) {
            return {params: params};
        } else {
            return true;
        }
    },
    ({ messages }: chat) => {
        if(messages) {
            return {messages: hasMessages(messages)};
        } else {
            return true;
        }
    }
];

obj.rulesTeamChat = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ d_created }: chat) => ({
        d_created: isDate(d_created, false)
    }),
    ({ status }: chat) => ({
        status: isString(status, 1, 10)
    }),
    ({ _attachments }: chat) => {
        if(_attachments) {
            return {_attachments: isObject(_attachments)};
        } else {
            return true;
        }
    },
    ({ messages }: chat) => {
        if(messages) {
            return {messages: hasMessages(messages)};
        } else {
            return true;
        }
    }
];

obj.rulesSetting = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ d_created }: record) => ({
        d_created: isDate(d_created, false)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ logo }: setting) => ({
        logo: isString(logo, 100, 200000)
    }),
    ({ title }: setting) => ({
        title: isString(title, 1, 50)
    }),
    ({ language }: setting) => ({
        language: isString(language, 2, 2)
    }),
    ({ langs }: setting) => ({
        langs: isArray(langs)
    }),
    ({ modules }: setting) => ({
        modules: isArray(modules)
    }),
    ({ importerUrl }: setting) => ({
        importerUrl: isUrl(importerUrl)
    }),
    ({ expire }: setting) => ({
        expire: isNumber(expire, 4, 48)
    }),
    ({ openings }: setting) => ({
        openings: isArray(openings)
    }),
    ({ timeZone }: setting) => ({
        timeZone: isString(timeZone, 5, 20)
    }),
    ({ systemAlarm1 }: setting) => ({
        systemAlarm1: isNumber(systemAlarm1, 1, 48)
    }),
    ({ systemAlarm2 }: setting) => ({
        systemAlarm2: isNumber(systemAlarm2, 0, 99)
    }),
    ({ systemAlarm3 }: setting) => ({
        systemAlarm3: isNumber(systemAlarm3, 0, 99)
    }),
    ({ chatOldisch }: setting) => ({
        chatOldisch: isNumber(chatOldisch, 0, 180)
    }),
    ({ promotionsSent }: setting) => ({
        promotionsSent: isNumber(promotionsSent, 1, 99)
    }),
    ({ phone }: setting) => ({
        phone: isString(phone, 10, 15)
    }),
    ({ phoneEmergency }: setting) => ({
        phoneEmergency: isString(phoneEmergency, 10, 15)
    }),
    ({ www }: setting) => {
        if(www) {
            return {www: isUrl(www)};
        } else {
            return true;
        }
    },
    ({ shopUrl }: setting) => {
        if(shopUrl) {
            return {shopUrl: isUrl(shopUrl)};
        } else {
            return true;
        }
    },
    ({ address }: setting) => {
        if(address) {
            return {address: isString(address, 1, 100)};
        } else {
            return true;
        }
    },
    ({ bankInfo }: setting) => {
        if(bankInfo) {
            return {bankInfo: isString(bankInfo, 1, 200)};
        } else {
            return true;
        }
    },
    ({ holidays }: setting) => {
        if(holidays) {
            return {holidays: isArray(holidays)};
        } else {
            return true;
        }
    },
    ({ emailStat }: setting) => {
        if(emailStat) {
            return {emailStat: isString(emailStat, 5, 200)};
        } else {
            return true;
        }
    },
    ({ payReminder1 }: setting) => {
        if(payReminder1) {
            return {payReminder1: isNumber(payReminder1, 0, 90)};
        } else {
            return true;
        }
    },
    ({ payReminder2 }: setting) => {
        if(payReminder2) {
            return {payReminder2: isNumber(payReminder2, 0, 90)};
        } else {
            return true;
        }
    },
    ({ cdm }: setting) => {
        if (cdm) {
            return { cdm: isString(cdm, 3, 15) };
        } else {
            return true;
        }
    },
    ({ shopWareSalesChannel }: setting) => {
        if(shopWareSalesChannel) {
            return {shopWareSalesChannel: isString(shopWareSalesChannel, 20, 64)};
        } else {
            return true;
        }
    },
    ({ shopWareDeliverTime }: setting) => {
        if (shopWareDeliverTime) {
            return { shopWareDeliverTime: isString(shopWareDeliverTime, 5, 5) };
        } else {
            return true;
        }
    },
    ({ payGateName }: setting) => {
        if (payGateName) {
            return { payGateName: isString(payGateName, 5, 50) };
        } else {
            return true;
        }
    },
    ({ hasQrScreen }: setting) => {
        if (hasQrScreen) {
            return { hasQrScreen: isBool(hasQrScreen) };
        } else {
            return true;
        }
    }
];

obj.rulesSettingTimestamp = [
    ({ _id }: record) => ({
        _id: isString(_id, 10, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ d_created }: record) => ({
        d_created: isDate(d_created, false)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ employeeGroups }: settingTimestamp) => ({
        employeeGroups: isArray(employeeGroups)
    }),
    ({ lastYearBooked }: settingTimestamp) => {
        if(lastYearBooked) {
            return {lastYearBooked: isDate(lastYearBooked)};
        } else {
            return true;
        }
    },
    ({ yearFrom }: settingTimestamp) => ({
        yearFrom: isString(yearFrom, 4, 4)
    }),
    ({ language }: settingTimestamp) => ({
        language: isString(language, 2, 2)
    }),
    ({ editPastDays }: settingTimestamp) => ({
        editPastDays: isNumber(editPastDays, 0, 365)
    }),
    ({ workFlow }: settingTimestamp) => {
        if(workFlow) {
            return {workFlow: isString(workFlow, 1, 20000)};
        } else {
            return true;
        }
    }
];

obj.rulesHoliday = [
    ({ partner }: holiday) => ({
        partner: isString(partner, 1, 64)
    }),
    ({ d_start }: holiday) => ({
        d_start: isDate(d_start)
    }),
    ({ d_end }: holiday) => ({
        d_end: isDate(d_end)
    })
];

obj.rulesUser = [
    ({ _id }: record) => ({
        _id: isString(_id, 7, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ updated_by }: record) => ({
        updated_by: isString(updated_by, 1, 32)
    }),
    ({ d_updated }: record) => ({
        d_updated: isDate(d_updated)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ firstname }: user) => ({
        firstname: isString(firstname, 1, 50)
    }),
    ({ surname }: user) => ({
        surname: isString(surname, 1, 50)
    }),
    ({ name }: user) => ({
        name: isString(name, 3, 50)
    }),
    ({ roles }: user) => ({
        roles: isArray(roles)
    }),
    ({ street }: user) => ({
        street: isString(street, 1, 50)
    }),
    ({ zip }: user) => ({
        zip: isString(zip, 1, 10)
    }),
    ({ city }: user) => ({
        city: isString(city, 1, 50)
    }),
    ({ country }: user) => ({
        country: isString(country, 1, 50)
    }),
    ({ gender }: user) => ({
        gender: isString(gender, 1, 1)
    }),
    ({ birthday }: user) => ({
        birthday: isDate(birthday)
    }),
    ({ email }: user) => {
        if(email) {
            return {email: isEmail(email)};
        } else if(email === '') {
            return {email: ''};
        } else {
            return true;
        }
    },
    ({ phone }: user) => {
        if(phone) {
            return {phone: isPhone(phone)};
        } else {
            return true;
        }
    },
    ({ artProds }: user) => {
        if(artProds) {
            return {artProds: isArray(artProds)};
        } else {
            return true;
        }
    },
    ({ afterTreats }: user) => {
        if(afterTreats) {
            return {afterTreats: isArray(afterTreats)};
        } else {
            return true;
        }
    },
    ({ qualis }: user) => {
        if(qualis) {
            return {qualis: isArray(qualis)};
        } else {
            return true;
        }
    },
    ({ rated }: user) => {
        if(rated) {
            return {rated: isArray(rated)};
        } else {
            return true;
        }
    },
    ({ iso }: user) => {
        if(iso) {
            return {iso: isString(iso, 2, 2)};
        } else {
            return true;
        }
    },
    ({ source }: user) => {
        if(source) {
            return {source: isString(source, 1, 20)};
        } else {
            return true;
        }
    },
    ({ status }: user) => {
        if(status) {
            return {status: isString(status, 1, 10)};
        } else {
            return true;
        }
    },
    ({ importer }: user) => {
        if(importer) {
            return {importer: isObject(importer)};
        } else {
            return true;
        }
    },
    ({ bring }: user) => {
        if(bring) {
            return {bring: isString(bring, 0, 150)};
        } else {
            return true;
        }
    },
    ({ pi }: user) => {
        if(pi) {
            return {pi: isString(pi, 0, 150)};
        } else {
            return true;
        }
    },
    ({ gi }: user) => {
        if(gi) {
            return {gi: isString(gi, 0, 150)};
        } else {
            return true;
        }
    },
    ({ encrypt }: user) => {
        if(typeof encrypt == 'boolean') {
            return {encrypt: isBool(encrypt)};
        } else {
            return true;
        }
    },
    ({ hasApp }: user) => {
        if(typeof hasApp == 'boolean') {
            return {hasApp: isBool(hasApp)};
        } else {
            return true;
        }
    },
    ({ fields }: user) => {
        if(fields) {
            return {fields: isObject(fields)};
        } else {
            return true;
        }
    },
    ({ allAgb }: user) => {
        if(allAgb) {
            return {allAgb: isDate(allAgb)};
        } else {
            return true;
        }
    },
    ({ password }: user) => {
        if(password) {
            return {password: isString(password, 4, 64)};
        } else {
            return true;
        }
    },
    ({ salt }: user) => {
        if(salt) {
            return {salt: isString(salt, 4, 64)};
        } else {
            return true;
        }
    },
    ({ password_scheme }: user) => {
        if(password_scheme) {
            return {password_scheme: isString(password_scheme, 4, 10)};
        } else {
            return true;
        }
    },
    ({ derived_key }: user) => {
        if(derived_key) {
            return {derived_key: isString(derived_key, 4, 64)};
        } else {
            return true;
        }
    },
    ({ iterations }: user) => {
        if(iterations) {
            return {iterations: isNumber(iterations)};
        } else {
            return true;
        }
    },
    ({ fcmId }: user) => {
        if(fcmId) {
            return {fcmId: isString(fcmId, 64, 200)};
        } else {
            return true;
        }
    },
    ({ apnsId }: user) => {
        if(apnsId) {
            return {apnsId: isString(apnsId, 64, 200)};
        } else {
            return true;
        }
    },
    ({ device }: user) => {
        if(device) {
            return {device: isString(device, 3, 20)};
        } else {
            return true;
        }
    },
    ({ format }: user) => {
        if(format) {
            return {format: isString(format, 4, 5)};
        } else {
            return {format: 'short'};
        }
    },
    ({ alarm }: user) => {
        if(alarm) {
            return {alarm: isNumber(alarm, 1, 99)};
        } else {
            return true;
        }
    },
    ({ delivery }: user) => {
        if(delivery) {
            return {delivery: isString(delivery, 1, 20)};
        } else {
            return true;
        }
    },
    ({ token }: user) => {
        if(token) {
            return {token: isString(token, 64, 200)};
        } else {
            return true;
        }
    },
    ({ tokenExpiration }: user) => {
        if(tokenExpiration) {
            return {tokenExpiration: isDate(tokenExpiration)};
        } else {
            return true;
        }
    },
    ({ availability }: user) => {
        if(availability) {
            return {availability: isArray(availability)};
        } else {
            return true;
        }
    },
    ({ shopWare }: user) => {
        if(shopWare) {
            return {shopWare: isString(shopWare, 10, 64)};
        } else {
            return true;
        }
    },
    ({ shopWarePayment }: user) => {
        if(shopWarePayment) {
            return {shopWarePayment: isString(shopWarePayment, 10, 64)};
        } else {
            return true;
        }
    },
    ({ employeeGroup }: user) => {
        if(employeeGroup || employeeGroup === 0) {
            return {employeeGroup: isNumber(employeeGroup, 0, 99)};
        } else {
            return true;
        }
    },
    ({ _attachments }: user) => {
        if(_attachments) {
            return {_attachments: isArray(_attachments)};
        } else {
            return true;
        }
    },
    ({ pensum }: user) => {
        if(pensum) {
            return {pensum: isObject(pensum)};
        } else {
            return true;
        }
    },
    ({ yearlySaldos }: user) => {
        if(yearlySaldos) {
            return {yearlySaldos: isObject(yearlySaldos)};
        } else {
            return true;
        }
    },
    ({ termination }: user) => {
        if(termination) {
            return {termination: isArray(termination)};
        } else {
            return true;
        }
    }
];

obj.rulesRating = [
    ({ uId }: rating) => ({
        uId: isString(uId, 10, 40)
    }),
    ({ d_created }: rating) => ({
        d_created: isDate(d_created)
    }),
    ({ rating }: rating) => ({
        rating: isNumber(rating, 1, 5)
    })
];

obj.rulesPayGateway = [
    ({ _id }: record) => ({
        _id: isString(_id, 7, 40)
    }),
    ({ type }: record) => ({
        type: isString(type, 1, 15)
    }),
    ({ _rev }: record) => {
        if(_rev) {
            return {_rev: isString(_rev, 20, 40)};
        } else {
            return true;
        }
    },
    ({ apiUrl }: payGateway) => ({
        apiUrl: isString(apiUrl, 10, 60)
    }),
    ({ kundennummer }: payGateway) => ({
        kundennummer: isNumber(kundennummer, 10000, 999999)
    }),
    ({ terminId }: payGateway) => ({
        terminId: isNumber(terminId, 10000, 999999999)
    }),
    ({ nutzername }: payGateway) => ({
        nutzername: isString(nutzername, 6, 32)
    }),
    ({ passwort }: payGateway) => ({
        passwort: isString(passwort, 6, 32)
    })
];

obj.pwd = {
    _pattern: /[a-zA-Z0-9_\-\+\.\*\%\(\))]/,

    _getRandomByte: function () {
        // http://caniuse.com/#feat=getrandomvalues
        if (window.crypto && window.crypto.getRandomValues) {
            const result = new Uint8Array(1);
            window.crypto.getRandomValues(result);
            return result[0];
        }
        // else if(window.msCrypto && window.msCrypto.getRandomValues)
        // {
        //     var result = new Uint8Array(1);
        //     window.msCrypto.getRandomValues(result);
        //     return result[0];
        // }
        else {
            return Math.floor(Math.random() * 256);
        }
    },

    generate: function (length: number) {
        return Array.apply(null, {'length': length})
            .map(function () {
                let result;
                while (true) {
                    result = String.fromCharCode(this._getRandomByte());
                    if (this._pattern.test(result)) {
                        return result;
                    }
                }
            }, this)
            .join('');
    }
};

export default obj;