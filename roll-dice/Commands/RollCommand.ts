import { IRead, IModify, IHttp, IPersistence, IModifyCreator, IMessageBuilder } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class RollCommand implements ISlashCommand {
    command: string = 'roll';
    i18nParamsExample: string = '6';
    i18nDescription: string = 'Roll the dice [maxNumber | 6]';
    providesPreview: boolean = false;

    private getRandomNumberAsString(maxNumber: number): string {
        return String(Math.floor(Math.random() * maxNumber));
    }

    async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const creator: IModifyCreator = modify.getCreator();

        const [argMaxNumber] = context.getArguments();
        const maxNumber: number = parseInt(argMaxNumber) || 6;

        const sender: IUser = (await read.getUserReader().getAppUser()) as IUser;
        const room: IRoom = context.getRoom();
        const messageTemplate: IMessage = {
            text: this.getRandomNumberAsString(maxNumber),
            sender,
            room
        };

        const messageBuilder: IMessageBuilder = creator.startMessage(messageTemplate);
        await creator.finish(messageBuilder);
    }
}