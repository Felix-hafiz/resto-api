import menuModel, { IMenu } from '../menuModel'
import { HttpError } from '../../utils/errorHandler'

export async function createMenu(payload: IMenu) {
    return await menuModel.create(payload)
}

export async function getAllMenus() {
    return await menuModel.find()
}

export async function getMenu(menuId: string) {
    const menu = await menuModel.findById(menuId)

    if (!menu) throw new HttpError(`menu:${menuId} Not Found!`, 404)

    return menu
}

export async function updateMenu(menuId: string, menuPayload: Partial<IMenu>) {
    const menu = await menuModel.findByIdAndUpdate(menuId, menuPayload, {
        returnDocument: 'after',
    })

    if (!menu) throw new HttpError(`menu:${menuId} Not Found!`, 404)

    return menu
}

export async function deleteMenu(menuId: string) {
    const menu = await menuModel.findByIdAndDelete(menuId)

    if (!menu) throw new HttpError(`menu:${menuId} Not Found!`, 404)

    return { message: 'Menu Deleted!' }
}
