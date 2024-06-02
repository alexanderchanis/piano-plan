import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useAuth = () => {

    const router = useRouter()

    const signOut = async () => {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()

        if ( error ) {
            toast.error("Couldn't sign out, please try again.")
            return
        }

        toast.success("Signed out successfully")
        router.push('/sign-in')
        router.refresh()
    }

    const isAuth = async () => {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()

        return data?.user
    }

    return { signOut, isAuth }
  }