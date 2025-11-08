
export type NotificationData<TData extends object> = TData & { severity?: 'info' | 'error' };