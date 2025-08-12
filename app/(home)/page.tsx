import Image from "next/image";
import ProjectForm from "@/modules/home/ui/ProjectForm";
import ProjectList from "@/modules/home/ui/ProjectList";

const Page = () => {
  return (
    <div className={"flex flex-col max-w-5xl mx-auto w-full"}>
      <section className={"space-y-6 py-[16vh] 2xl:py-46"}>
        <div className={"flex flex-col items-center"}>
          <Image
            src={"/logo.svg"}
            alt={"Clarna"}
            width={50}
            height={50}
            className={"hidden md:block"}
          />
        </div>
        <h1 className={"text-2xl md:text-5xl font-bold text-center"}>
          Build something with Clarna
        </h1>
        <p className={"text-lg md:text-xl text-muted-foreground text-center"}>
          Create apps and websites by chatting with AI
        </p>
        <div className={"max-w-3xl mx-auto w-full"}>
          <ProjectForm />
        </div>
      </section>
      <ProjectList />
    </div>
  );
};

export default Page;
