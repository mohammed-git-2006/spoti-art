
import {Panel} from "@/src/components/Panel";
import { redirect } from "next/navigation";
import CallbackActionPage from "./action";

export default async function CallbackPage({searchParams} : {searchParams:any})
{
  const code = (await searchParams).code

  if (!code)
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Panel>
          No code received
        </Panel>
      </div>
    );

  return <CallbackActionPage code={code} />
}
