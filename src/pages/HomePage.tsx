import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">{t("app.title")}</h1>
                <p className="text-muted-foreground">{t("app.description")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("document.upload")}</h2>
                    <p className="text-muted-foreground mb-4">{t("document.uploadDescription")}</p>
                    <Button>{t("common.upload")}</Button>
                </div>

                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("document.recent")}</h2>
                    <p className="text-muted-foreground">{t("document.empty")}</p>
                </div>
            </div>

            <div className="mt-8 border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t("navigation.chat")}</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={t("chat.placeholder")}
                        className="flex-1 border rounded-md px-4 py-2"
                    />
                    <Button>{t("chat.send")}</Button>
                </div>
            </div>
        </div>
    )
}
