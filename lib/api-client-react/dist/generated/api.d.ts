import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminAuthStatus, AdminLoginInput, Blog, BlogInput, BlogUpdate, HealthStatus, Inquiry, InquiryInput, InquiryUpdate, ListBlogsParams, ListProjectsParams, Project, ProjectInput, ProjectUpdate, Settings, SettingsUpdate, TeamMember, TeamMemberInput, TeamMemberUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListProjectsUrl: (params?: ListProjectsParams) => string;
/**
 * @summary List all projects
 */
export declare const listProjects: (params?: ListProjectsParams, options?: RequestInit) => Promise<Project[]>;
export declare const getListProjectsQueryKey: (params?: ListProjectsParams) => readonly ["/api/projects", ...ListProjectsParams[]];
export declare const getListProjectsQueryOptions: <TData = Awaited<ReturnType<typeof listProjects>>, TError = ErrorType<unknown>>(params?: ListProjectsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProjects>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProjectsQueryResult = NonNullable<Awaited<ReturnType<typeof listProjects>>>;
export type ListProjectsQueryError = ErrorType<unknown>;
/**
 * @summary List all projects
 */
export declare function useListProjects<TData = Awaited<ReturnType<typeof listProjects>>, TError = ErrorType<unknown>>(params?: ListProjectsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateProjectUrl: () => string;
/**
 * @summary Create a project
 */
export declare const createProject: (projectInput: ProjectInput, options?: RequestInit) => Promise<Project>;
export declare const getCreateProjectMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProject>>, TError, {
        data: BodyType<ProjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProject>>, TError, {
    data: BodyType<ProjectInput>;
}, TContext>;
export type CreateProjectMutationResult = NonNullable<Awaited<ReturnType<typeof createProject>>>;
export type CreateProjectMutationBody = BodyType<ProjectInput>;
export type CreateProjectMutationError = ErrorType<unknown>;
/**
* @summary Create a project
*/
export declare const useCreateProject: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProject>>, TError, {
        data: BodyType<ProjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProject>>, TError, {
    data: BodyType<ProjectInput>;
}, TContext>;
export declare const getGetProjectUrl: (id: string) => string;
/**
 * @summary Get a project by ID or slug
 */
export declare const getProject: (id: string, options?: RequestInit) => Promise<Project>;
export declare const getGetProjectQueryKey: (id: string) => readonly [`/api/projects/${string}`];
export declare const getGetProjectQueryOptions: <TData = Awaited<ReturnType<typeof getProject>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProjectQueryResult = NonNullable<Awaited<ReturnType<typeof getProject>>>;
export type GetProjectQueryError = ErrorType<void>;
/**
 * @summary Get a project by ID or slug
 */
export declare function useGetProject<TData = Awaited<ReturnType<typeof getProject>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateProjectUrl: (id: string) => string;
/**
 * @summary Update a project
 */
export declare const updateProject: (id: string, projectUpdate: ProjectUpdate, options?: RequestInit) => Promise<Project>;
export declare const getUpdateProjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProject>>, TError, {
        id: string;
        data: BodyType<ProjectUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProject>>, TError, {
    id: string;
    data: BodyType<ProjectUpdate>;
}, TContext>;
export type UpdateProjectMutationResult = NonNullable<Awaited<ReturnType<typeof updateProject>>>;
export type UpdateProjectMutationBody = BodyType<ProjectUpdate>;
export type UpdateProjectMutationError = ErrorType<void>;
/**
* @summary Update a project
*/
export declare const useUpdateProject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProject>>, TError, {
        id: string;
        data: BodyType<ProjectUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProject>>, TError, {
    id: string;
    data: BodyType<ProjectUpdate>;
}, TContext>;
export declare const getDeleteProjectUrl: (id: string) => string;
/**
 * @summary Delete a project
 */
export declare const deleteProject: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteProjectMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProject>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteProject>>, TError, {
    id: string;
}, TContext>;
export type DeleteProjectMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProject>>>;
export type DeleteProjectMutationError = ErrorType<unknown>;
/**
* @summary Delete a project
*/
export declare const useDeleteProject: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProject>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteProject>>, TError, {
    id: string;
}, TContext>;
export declare const getListBlogsUrl: (params?: ListBlogsParams) => string;
/**
 * @summary List all blog posts
 */
export declare const listBlogs: (params?: ListBlogsParams, options?: RequestInit) => Promise<Blog[]>;
export declare const getListBlogsQueryKey: (params?: ListBlogsParams) => readonly ["/api/blogs", ...ListBlogsParams[]];
export declare const getListBlogsQueryOptions: <TData = Awaited<ReturnType<typeof listBlogs>>, TError = ErrorType<unknown>>(params?: ListBlogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBlogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBlogsQueryResult = NonNullable<Awaited<ReturnType<typeof listBlogs>>>;
export type ListBlogsQueryError = ErrorType<unknown>;
/**
 * @summary List all blog posts
 */
export declare function useListBlogs<TData = Awaited<ReturnType<typeof listBlogs>>, TError = ErrorType<unknown>>(params?: ListBlogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateBlogUrl: () => string;
/**
 * @summary Create a blog post
 */
export declare const createBlog: (blogInput: BlogInput, options?: RequestInit) => Promise<Blog>;
export declare const getCreateBlogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBlog>>, TError, {
        data: BodyType<BlogInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBlog>>, TError, {
    data: BodyType<BlogInput>;
}, TContext>;
export type CreateBlogMutationResult = NonNullable<Awaited<ReturnType<typeof createBlog>>>;
export type CreateBlogMutationBody = BodyType<BlogInput>;
export type CreateBlogMutationError = ErrorType<unknown>;
/**
* @summary Create a blog post
*/
export declare const useCreateBlog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBlog>>, TError, {
        data: BodyType<BlogInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBlog>>, TError, {
    data: BodyType<BlogInput>;
}, TContext>;
export declare const getGetBlogUrl: (id: string) => string;
/**
 * @summary Get a blog post by ID or slug
 */
export declare const getBlog: (id: string, options?: RequestInit) => Promise<Blog>;
export declare const getGetBlogQueryKey: (id: string) => readonly [`/api/blogs/${string}`];
export declare const getGetBlogQueryOptions: <TData = Awaited<ReturnType<typeof getBlog>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBlog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBlog>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBlogQueryResult = NonNullable<Awaited<ReturnType<typeof getBlog>>>;
export type GetBlogQueryError = ErrorType<void>;
/**
 * @summary Get a blog post by ID or slug
 */
export declare function useGetBlog<TData = Awaited<ReturnType<typeof getBlog>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBlog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateBlogUrl: (id: string) => string;
/**
 * @summary Update a blog post
 */
export declare const updateBlog: (id: string, blogUpdate: BlogUpdate, options?: RequestInit) => Promise<Blog>;
export declare const getUpdateBlogMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBlog>>, TError, {
        id: string;
        data: BodyType<BlogUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBlog>>, TError, {
    id: string;
    data: BodyType<BlogUpdate>;
}, TContext>;
export type UpdateBlogMutationResult = NonNullable<Awaited<ReturnType<typeof updateBlog>>>;
export type UpdateBlogMutationBody = BodyType<BlogUpdate>;
export type UpdateBlogMutationError = ErrorType<void>;
/**
* @summary Update a blog post
*/
export declare const useUpdateBlog: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBlog>>, TError, {
        id: string;
        data: BodyType<BlogUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBlog>>, TError, {
    id: string;
    data: BodyType<BlogUpdate>;
}, TContext>;
export declare const getDeleteBlogUrl: (id: string) => string;
/**
 * @summary Delete a blog post
 */
export declare const deleteBlog: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteBlogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBlog>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBlog>>, TError, {
    id: string;
}, TContext>;
export type DeleteBlogMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBlog>>>;
export type DeleteBlogMutationError = ErrorType<unknown>;
/**
* @summary Delete a blog post
*/
export declare const useDeleteBlog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBlog>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBlog>>, TError, {
    id: string;
}, TContext>;
export declare const getListTeamMembersUrl: () => string;
/**
 * @summary List team members
 */
export declare const listTeamMembers: (options?: RequestInit) => Promise<TeamMember[]>;
export declare const getListTeamMembersQueryKey: () => readonly ["/api/team"];
export declare const getListTeamMembersQueryOptions: <TData = Awaited<ReturnType<typeof listTeamMembers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTeamMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTeamMembers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTeamMembersQueryResult = NonNullable<Awaited<ReturnType<typeof listTeamMembers>>>;
export type ListTeamMembersQueryError = ErrorType<unknown>;
/**
 * @summary List team members
 */
export declare function useListTeamMembers<TData = Awaited<ReturnType<typeof listTeamMembers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTeamMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateTeamMemberUrl: () => string;
/**
 * @summary Create a team member
 */
export declare const createTeamMember: (teamMemberInput: TeamMemberInput, options?: RequestInit) => Promise<TeamMember>;
export declare const getCreateTeamMemberMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTeamMember>>, TError, {
        data: BodyType<TeamMemberInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTeamMember>>, TError, {
    data: BodyType<TeamMemberInput>;
}, TContext>;
export type CreateTeamMemberMutationResult = NonNullable<Awaited<ReturnType<typeof createTeamMember>>>;
export type CreateTeamMemberMutationBody = BodyType<TeamMemberInput>;
export type CreateTeamMemberMutationError = ErrorType<unknown>;
/**
* @summary Create a team member
*/
export declare const useCreateTeamMember: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTeamMember>>, TError, {
        data: BodyType<TeamMemberInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTeamMember>>, TError, {
    data: BodyType<TeamMemberInput>;
}, TContext>;
export declare const getGetTeamMemberUrl: (id: number) => string;
/**
 * @summary Get a team member
 */
export declare const getTeamMember: (id: number, options?: RequestInit) => Promise<TeamMember>;
export declare const getGetTeamMemberQueryKey: (id: number) => readonly [`/api/team/${number}`];
export declare const getGetTeamMemberQueryOptions: <TData = Awaited<ReturnType<typeof getTeamMember>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeamMember>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTeamMember>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTeamMemberQueryResult = NonNullable<Awaited<ReturnType<typeof getTeamMember>>>;
export type GetTeamMemberQueryError = ErrorType<void>;
/**
 * @summary Get a team member
 */
export declare function useGetTeamMember<TData = Awaited<ReturnType<typeof getTeamMember>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeamMember>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateTeamMemberUrl: (id: number) => string;
/**
 * @summary Update a team member
 */
export declare const updateTeamMember: (id: number, teamMemberUpdate: TeamMemberUpdate, options?: RequestInit) => Promise<TeamMember>;
export declare const getUpdateTeamMemberMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTeamMember>>, TError, {
        id: number;
        data: BodyType<TeamMemberUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTeamMember>>, TError, {
    id: number;
    data: BodyType<TeamMemberUpdate>;
}, TContext>;
export type UpdateTeamMemberMutationResult = NonNullable<Awaited<ReturnType<typeof updateTeamMember>>>;
export type UpdateTeamMemberMutationBody = BodyType<TeamMemberUpdate>;
export type UpdateTeamMemberMutationError = ErrorType<void>;
/**
* @summary Update a team member
*/
export declare const useUpdateTeamMember: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTeamMember>>, TError, {
        id: number;
        data: BodyType<TeamMemberUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTeamMember>>, TError, {
    id: number;
    data: BodyType<TeamMemberUpdate>;
}, TContext>;
export declare const getDeleteTeamMemberUrl: (id: number) => string;
/**
 * @summary Delete a team member
 */
export declare const deleteTeamMember: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTeamMemberMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTeamMember>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTeamMember>>, TError, {
    id: number;
}, TContext>;
export type DeleteTeamMemberMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTeamMember>>>;
export type DeleteTeamMemberMutationError = ErrorType<unknown>;
/**
* @summary Delete a team member
*/
export declare const useDeleteTeamMember: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTeamMember>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTeamMember>>, TError, {
    id: number;
}, TContext>;
export declare const getGetSettingsUrl: () => string;
/**
 * @summary Get site settings
 */
export declare const getSettings: (options?: RequestInit) => Promise<Settings>;
export declare const getGetSettingsQueryKey: () => readonly ["/api/settings"];
export declare const getGetSettingsQueryOptions: <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>;
export type GetSettingsQueryError = ErrorType<unknown>;
/**
 * @summary Get site settings
 */
export declare function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateSettingsUrl: () => string;
/**
 * @summary Update site settings
 */
export declare const updateSettings: (settingsUpdate: SettingsUpdate, options?: RequestInit) => Promise<Settings>;
export declare const getUpdateSettingsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<SettingsUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<SettingsUpdate>;
}, TContext>;
export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>;
export type UpdateSettingsMutationBody = BodyType<SettingsUpdate>;
export type UpdateSettingsMutationError = ErrorType<unknown>;
/**
* @summary Update site settings
*/
export declare const useUpdateSettings: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<SettingsUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<SettingsUpdate>;
}, TContext>;
export declare const getListInquiriesUrl: () => string;
/**
 * @summary List all contact inquiries (admin)
 */
export declare const listInquiries: (options?: RequestInit) => Promise<Inquiry[]>;
export declare const getListInquiriesQueryKey: () => readonly ["/api/inquiries"];
export declare const getListInquiriesQueryOptions: <TData = Awaited<ReturnType<typeof listInquiries>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInquiries>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listInquiries>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListInquiriesQueryResult = NonNullable<Awaited<ReturnType<typeof listInquiries>>>;
export type ListInquiriesQueryError = ErrorType<unknown>;
/**
 * @summary List all contact inquiries (admin)
 */
export declare function useListInquiries<TData = Awaited<ReturnType<typeof listInquiries>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInquiries>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateInquiryUrl: () => string;
/**
 * @summary Submit a contact inquiry (public)
 */
export declare const createInquiry: (inquiryInput: InquiryInput, options?: RequestInit) => Promise<Inquiry>;
export declare const getCreateInquiryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInquiry>>, TError, {
        data: BodyType<InquiryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createInquiry>>, TError, {
    data: BodyType<InquiryInput>;
}, TContext>;
export type CreateInquiryMutationResult = NonNullable<Awaited<ReturnType<typeof createInquiry>>>;
export type CreateInquiryMutationBody = BodyType<InquiryInput>;
export type CreateInquiryMutationError = ErrorType<unknown>;
/**
* @summary Submit a contact inquiry (public)
*/
export declare const useCreateInquiry: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInquiry>>, TError, {
        data: BodyType<InquiryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createInquiry>>, TError, {
    data: BodyType<InquiryInput>;
}, TContext>;
export declare const getUpdateInquiryUrl: (id: number) => string;
/**
 * @summary Update inquiry status (admin)
 */
export declare const updateInquiry: (id: number, inquiryUpdate: InquiryUpdate, options?: RequestInit) => Promise<Inquiry>;
export declare const getUpdateInquiryMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInquiry>>, TError, {
        id: number;
        data: BodyType<InquiryUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateInquiry>>, TError, {
    id: number;
    data: BodyType<InquiryUpdate>;
}, TContext>;
export type UpdateInquiryMutationResult = NonNullable<Awaited<ReturnType<typeof updateInquiry>>>;
export type UpdateInquiryMutationBody = BodyType<InquiryUpdate>;
export type UpdateInquiryMutationError = ErrorType<void>;
/**
* @summary Update inquiry status (admin)
*/
export declare const useUpdateInquiry: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInquiry>>, TError, {
        id: number;
        data: BodyType<InquiryUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateInquiry>>, TError, {
    id: number;
    data: BodyType<InquiryUpdate>;
}, TContext>;
export declare const getDeleteInquiryUrl: (id: number) => string;
/**
 * @summary Delete an inquiry (admin)
 */
export declare const deleteInquiry: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteInquiryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInquiry>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteInquiry>>, TError, {
    id: number;
}, TContext>;
export type DeleteInquiryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteInquiry>>>;
export type DeleteInquiryMutationError = ErrorType<unknown>;
/**
* @summary Delete an inquiry (admin)
*/
export declare const useDeleteInquiry: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInquiry>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteInquiry>>, TError, {
    id: number;
}, TContext>;
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Admin login
 */
export declare const adminLogin: (adminLoginInput: AdminLoginInput, options?: RequestInit) => Promise<AdminAuthStatus>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginInput>;
export type AdminLoginMutationError = ErrorType<void>;
/**
* @summary Admin login
*/
export declare const useAdminLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
export declare const getAdminLogoutUrl: () => string;
/**
 * @summary Admin logout
 */
export declare const adminLogout: (options?: RequestInit) => Promise<void>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
* @summary Admin logout
*/
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export declare const getAdminMeUrl: () => string;
/**
 * @summary Get current admin auth status
 */
export declare const adminMe: (options?: RequestInit) => Promise<AdminAuthStatus>;
export declare const getAdminMeQueryKey: () => readonly ["/api/admin/me"];
export declare const getAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof adminMe>>>;
export type AdminMeQueryError = ErrorType<unknown>;
/**
 * @summary Get current admin auth status
 */
export declare function useAdminMe<TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map