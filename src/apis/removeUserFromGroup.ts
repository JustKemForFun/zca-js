import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";

export type RemoveUserFromGroupResponse = {
    errorMembers: string[];
};

export const removeUserFromGroupFactory = apiFactory<RemoveUserFromGroupResponse>()((api, ctx, utils) => {
    const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/kickout`);

    /**
     * Remove user from existing group
     *
     * @param memberId User ID or list of user IDs to remove
     * @param groupId Group ID
     *
     * @note Zalo might throw an error with code 165 if the user is not in the group, 166 if you don't have enough permissions or is not in the group
     *
     * @throws ZaloApiError
     */
    return async function removeUserFromGroup(memberId: string | string[], groupId: string) {
        if (!Array.isArray(memberId)) memberId = [memberId];

        const params: any = {
            grid: groupId,
            members: memberId,
            imei: ctx.imei,
        };

        const encryptedParams = utils.encodeAES(JSON.stringify(params));
        if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");

        const response = await utils.request(serviceURL, {
            method: "POST",
            body: new URLSearchParams({
                params: encryptedParams,
            }),
        });

        return utils.resolve(response);
    };
});
