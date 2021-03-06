import { AuthUser } from "./authUser";

export class Constants {
    public static readonly loggerName: string = "Logger";

    public static readonly defaultImage = "./assets/images/user.png";
    public static readonly notFoundTip = "Sorry, no matched entity found!";
    public static user = new AuthUser();
}