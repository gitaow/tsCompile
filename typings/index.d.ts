declare const app: any;

interface record {
    _id: string;
    _rev?: string;
    type: string;
    d_created: string;
    d_updated?: string;
    updated_by?: string;
}

interface recordUser extends record {
    clientId: number;
}

interface article extends record {
    title: string;
    txt: string;
    bookingPlace: string;
    titlePic?: string;
    treatment?: string;
    productLinks?: string[];
    avgRating?: number;
    cnt?: number;
    translations?: object[];
    archive?: boolean;
    templateRef?: {};
    quickSelect?: boolean;
    startSelect?: boolean;
    titleCode?: string;
    duration?: number;
    afterDuration?: number;
    warningMsg?: string;
    warningMerge?: boolean;
    mergeDuration?: number;
    pos?: number;
}

interface template extends record {
    title: string;
    txt: string;
    titlePic?: string;
    description: string;
    translations?: object[];
    buy?: number;
}

interface product extends record {
    title: string;
    txt: string;
    translations?: object[];
    price: number;
    unit: string;
    quantity: number;
    web?: string;
    titlePic?: string;
    pos?: number;
    archive?: boolean;
}

interface partner extends record {
    name: string;
    zip: string;
    street: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    web: string;
    offering?: string;
    openTimes?: string;
    pic?: string;
    pos?: number;
}

interface stamp {
    d_start: string;
    d_end?: string;
    typ: number;
    factor: number;
    commentStart?: string;
    commentEnd?: string;
    commentOutside?: string;
    commentHoliday?: string;
    abs?: string;
    overtime?: string;
    day?: boolean;
    toCheck?: string;
    approveUsrEdit?: string;
    edited?: string;
    ip?: string;
}

interface timestamp extends recordUser {
    stamps: stamp[];
    soll: number;
    total: number[];
    overtime: number;
    // unpaid: number;
    previous?: number;
    booked?: string;
    usrApproved?: string;
    description?: string;
}

interface shift extends record {
    clientId: string;
    d_start: string;
    d_end: string;
    typ: number;
    cost: number;
    title: string;
    uId: string;
    deleted?: boolean;
}

interface absence extends recordUser {
    d_start: string;
    d_end: string;
    typ: number;
    reason?: string;
    approved?: boolean;
    d_deleted?: string;
    _attachments?: any;
}

interface bankHoliday extends record {
    title: string;
    d_start: string;
    typ: number;
    formula?: string;
}

interface pensum {
    d_start: string;
    d_end?: string;
    value: string;
    eGroup: number;
    holidays: number;
    days?: number[][];
}

interface saldos {
    prevSaldo: number;
    prevHoli: number;
    soll: number;
    is: number;
    holidays: number;
    holidaysUsed: number;
    payoutSaldo: number;
    payoutHoli: number;
    booked?: string;
    usrApproved?: string;
    usrDeclined?: string;
    reasonNegSaldo?: string;
    reasonNegHoli?: string;
}

interface user extends record {
    password?: string;
    password_scheme?: string;
    iterations?: number;
    salt?: string;
    derived_key?: string;
    name: string;
    firstname: string;
    surname: string;
    street: string;
    zip: string;
    city: string;
    country: string;
    email?: string;
    phone?: string;
    gender: string;
    birthday: string;
    fields?: any[];
    roles?: string[];
    artProds?: string[];
    afterTreats?: string[];
    qualis?: string[];
    iso?: string;
    source: string;
    status?: string;
    importer?: any;
    bring?: string;
    pi?: string;
    gi?: string;
    encrypt?: boolean;
    hasApp?: boolean;
    allAgb?: string;
    fcmId?: string;
    apnsId?: string;
    device?: string;
    format: string;
    alarm?: number;
    delivery?: string;
    token?: string;
    tokenExpiration?: string;
    _attachments?: any;
    rated?: string[];
    userRev?: string;
    availability?: any[];
    shopWare?: string;
    shopWarePayment?: string;
    employeeGroup?: number;
    pensum?: object;
    yearlySaldos?: object;
    termination?: any[];
}
/*
interface user_ext {
    profession: string;
    employer: string;
    ahvNr: string;
    abroad_street: string;
    abroad_zip: string;
    abroad_city: string;
    abroad_country: string;
    invoice_pay: string;
    invoice_insurance: string;
    insurance1: string;
    insurance2: string;
    socialservices: string;
    general_practitioner: string;
    previous_doctor: string;
    howLearned: string;
    reasonVisit: string;
    med_history: any;
    clAgbs?: string;
}
*/
interface message {
    origin: string;
    txt?: string;
    replyYesNo?: boolean;
    d_created: string;
    d_replicated?: string;
    d_seen?: string;
    pics?: string[];
    tmpPics?: any;
}

interface chat extends recordUser {
    messages: message[];
    status: string;
    params?: object;
    needAnswer?: string;
    d_needAnswer?: string;
    replyYesNo?: boolean;
    _attachments?: any;
    d_replicated?: string;
    d_lastOpened?: string;
}

interface teamChat extends record {
    messages: message[];
    status: string;
    _attachments?: any;
}

interface orderIntPos {
    _id: string;
    amount: number;
    price: number;
    status: string;
}

interface orderInt extends recordUser {
    items: orderIntPos[];
    total: number;
    delivery: string;
    status: string;
    d_payed?: string;
}

interface orderExtPos {
    _id: string;
    title: string,
    unit: string,
    quantity: number,
    amount: number;
    price: number;
}

interface orderExt extends recordUser {
    items: orderExtPos[];
    total: number;
    status: string;
    d_payed?: string;
}

interface promotion extends record {
    refId: string;
    title?: string;
    titleOverride?: string;
    target: string;
    d_start?: string;
    d_end?: string;
    recipients?: any[];
    author: string;
    visum?: string;
    d_sent?: string;
    status?: string;
    archive?: boolean;
}

interface proposal {
    origin: string;
    d_proposal: string;
    d_proposalTo: string;
    d_created: string;
    d_replicated?: string;
    txt?: string;
    status: string;
}

interface appointment extends recordUser {
    title: string;
    titleCode?: string;
    duration?: number;
    proposals: proposal[];
    d_appointment?: string;
    d_replicated?: string;
    d_userCancel?: string;
    cancelled?: string;
    hasOnlyRejects?: boolean;
    archive?: boolean;
    reasonArchive?: string;
    d_accept?: string;
    d_confirm_alarm1?: string;
    d_confirm_alarm2?: string;
    d_confirm_alarm3?: string;
    importId?: string;
    d_imported?: string;
    showImportId?: string;
}

interface media extends record {
    refId: string;
    name: string;
    date: string;
    size: number;
    mime: string;
    data: string;
}

interface payment extends recordUser {
    importId: string;
    showImportId: string;
    d_imported?: string;
    amount: number;
    total: number;
    payNr: string;
    status: number;
    requestId?: string;
    transactionId?: string;
    d_replicated?: string;
    d_reminder1?: string;
    d_reminder2?: string;
}

interface treatment extends recordUser {
    title: string;
    txt: string;
    d_deleted?: string;
    reminders?: any[];
    status?: string;
    d_replicated?: string;
}

interface holiday {
    d_start: string;
    d_end: string;
    partner: string;
}

interface phoneNumbrer {
    title: string,
    txt: string
}

interface setting extends record {
    logo: string;
    title: string;
    language: string;
    systemAlarm1: number;
    expire: number;
    bankInfo: string;
    emailStat: string;
    openings: any[];
    timeZone: string;
    phone: string;
    www?: string;
    shopUrl?: string;
    address?: string;
    importerUrl?: string;
    systemAlarm2: number;
    systemAlarm3: number;
    chatOldisch: number;
    promotionsSent: number;
    holidays?: holiday[];
    langs: any[];
    modules: any[];
    phoneEmergency: string;
    payReminder1?: number;
    payReminder2?: number;
    cdm?: string;
    shopWareSalesChannel?: string;
    shopWareDeliverTime?: string;
    payGateName?: string;
    hasQrScreen?: boolean;
}

interface settingTimestamp extends record {
    employeeGroups: any[]
    lastYearBooked: string;
    yearFrom: string;
    editPastDays: number;
    language: string;
    workFlow?: string;
}

interface rating {
    uId: string
    rating: number;
    d_created: string;
}

interface tipsTricks extends record {
    title: string;
    txt: string;
    category: string;
    recipeOptions?: string[];
    archive?: boolean;
}

interface workflow extends record {
    title: string;
    txt: string;
    category: string;
    archive?: boolean;
}

interface payGateway extends record {
    apiUrl: string;
    kundennummer: number;
    terminId: number;
    nutzername: string;
    passwort: string;
}

interface importStatus {
    id: string;
    showImportId: string;
    d_updated: string;
    txt?: string;
    changes: string[];
    conflict?: string[];
}

interface invalid {
    errorMessage: string;
}

interface errInput {
    field: string;
    txt: string;
}

// export { importDriver } from '../importer/importer.class'