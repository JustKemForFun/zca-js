import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";

export type UndoFriendRequestResponse = "";

export const undoFriendRequestFactory = apiFactory<UndoFriendRequestResponse>()((api, _ctx, utils) => {
    const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/undo`);

    /**
     * Undo send a friend request to a user.
     *
     * @param options
     *
     * @throws ZaloApiError
     */
    return async function undoFriendRequest(friendId: string) {
        const params = {
            fid: friendId,
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
