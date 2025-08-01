import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { ThreadType, BinBankCard } from "../models/index.js";
import { apiFactory } from "../utils.js";

export type SendBankCardPayload = {
    binBank: BinBankCard;
    numAccBank: string;
    nameAccBank?: string;
};

export type SendBankCardResponse = "";

export const sendBankCardFactory = apiFactory<SendBankCardResponse>()((api, ctx, utils) => {
    const serviceURL = utils.makeURL(`${api.zpwServiceMap.zimsg[0]}/api/transfer/card`);

    /**
     * Send bank card
     *
     * @param payload The payload containing the bank card information
     * @param threadId The ID of the thread to send the bank card to
     * @param type REQUIRE The type of thread to send the bank card to
     *
     * @note message call key eg: 99867xxxxx vietcombank (key: vietcombank, sacombank, etc,...)
     *
     * @throws ZaloApiError
     */
    return async function sendBankCard(payload: SendBankCardPayload, threadId: string, type: ThreadType) {
        const params = {
            binBank: payload.binBank,
            numAccBank: payload.numAccBank,
            nameAccBank: payload.nameAccBank?.toUpperCase() || "---",
            cliMsgId: Date.now().toString(),
            tsMsg: Date.now(),
            destUid: threadId,
            destType: type === ThreadType.Group ? 1 : 0,
        };

        const encryptedParams = utils.encodeAES(JSON.stringify(params));
        if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");

        const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), {
            method: "GET",
        });

        return utils.resolve(response);
    };
});
