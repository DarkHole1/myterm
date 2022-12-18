enum Reason {
    // Common
    ImATeapot = 'Я вообще-то чайник.',
    NotAnAdmin = 'Это действие могут совершить только администраторы.',
    ValidationFailed = 'Каких-то параметров не хватает для работы. Если вы видите эту ошибку, обратитесь к разработчику.',
    // Roles
    UserWithRole = 'Такая роль есть у какого-то пользователя.',
    RoleNotFound = 'Роль не найдена.'
}

export default Reason